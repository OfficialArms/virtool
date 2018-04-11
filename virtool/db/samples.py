import os

import pymongo

import virtool.utils
import virtool.samples


async def check_name(db, settings, name, sample_id=None):

    if settings["sample_unique_names"]:
        query = {
            "name": name
        }

        if sample_id:
            query["_id"] = {
                "$ne": sample_id
            }

        if await db.samples.count(query):
            return "Sample name is already in use"

    return None


async def get_sample_owner(db, sample_id: str):
    """
    A Shortcut function for getting the owner user id of a sample given its ``sample_id``.

    :param db: the application database client
    :type db: :class:`~motor.motor_asyncio.AsyncIOMotorClient`

    :param sample_id: the id of the sample to get the owner for
    :type sample_id: str

    :return: the id of the owner user

    """
    document = await db.samples.find_one(sample_id, ["user"])

    if document:
        return document["user"]["id"]

    return None


async def recalculate_algorithm_tags(db, sample_id):
    """
    Recalculate and apply algorithm tags (eg. "ip", True) for a given sample. Finds the associated analyses and calls
    :func:`calculate_algorithm_tags`, then applies the update to the sample document.

    :param db: the application database client
    :type db: :class:`~motor.motor_asyncio.AsyncIOMotorClient`

    :param sample_id: the id of the sample to recalculate tags for
    :type sample_id: str

    """
    analyses = await db.analyses.find({"sample.id": sample_id}, ["ready", "algorithm"]).to_list(None)

    update = virtool.samples.calculate_algorithm_tags(analyses)

    document = await db.samples.find_one_and_update({"_id": sample_id}, {
        "$set": update
    }, return_document=pymongo.ReturnDocument.AFTER, projection=virtool.samples.LIST_PROJECTION)

    return document


async def remove_samples(db, settings, id_list):
    """
    Complete removes the samples identified by the document ids in ``id_list``. In order, it:

    - removes all analyses associated with the sample from the analyses collection
    - removes the sample from the samples collection
    - removes the sample directory from the file system

    :param db: a Motor client
    :type db: :class:`.motor.motor_asyncio.AsyncIOMotorClient``

    :param settings: the application settings object
    :type settings: :class:`virtool.app_settings.Settings`

    :param id_list: a list sample ids to remove
    :type id_list: list

    :return: the result from the samples collection remove operation
    :rtype: Coroutine[dict]

    """
    if not isinstance(id_list, list):
        raise TypeError("id_list must be a list")

    # Remove all analysis documents associated with the sample.
    await db.analyses.delete_many({"sample.id": {
        "$in": id_list
    }})

    # Remove the samples described by id_list from the database.
    result = await db.samples.delete_many({"_id": {
        "$in": id_list
    }})

    samples_path = os.path.join(settings.get("data_path"), "samples")

    for sample_id in id_list:
        try:
            virtool.utils.rm(os.path.join(samples_path, "sample_{}".format(sample_id)), recursive=True)
        except FileNotFoundError:
            pass

    return result
