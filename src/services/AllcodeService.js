import db from '../models/index';
const getAllProvinces = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let provinces = await db.Allcode.findAll(
                { where: { type: 'PROVINCE' } }
            );
            resolve({
                errCode: 0,
                message: 'Success',
                data: provinces
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    getAllProvinces: getAllProvinces
}