import bookingService from '../services/BookingService';

const createNewBooking = async (req, res) => {
    try {
        let response = await bookingService.createNewBooking(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.createNewBooking', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const userConfirmBooking = async (req, res) => {
    const id = req.params.id;
    try {
        let response = await bookingService.userConfirmBooking(id);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.userConfirmBooking', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const doctorConfirmBooking = async (req, res) => {
    const id = req.body.bookingId;
    try {
        let response = await bookingService.doctorConfirmBooking(id);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.doctorConfirmBooking', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const doctorRejectBooking = async (req, res) => {
    const bookingId = req.body.bookingId;
    try {
        let response = await bookingService.doctorRejectBooking(bookingId);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.doctorConfirmBooking', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getBookingByUserId = async (req, res) => {
    let { id } = req.params;
    let status = req.query.status;
    try {
        let response = await bookingService.getAllBookingByUserId(id, status);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.getBookingByUserId', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getBookingByDoctorId = async (req, res) => {
    let { id } = req.params;
    let status = req.query.status;
    try {
        let response = await bookingService.getAllBookingByDoctorId(id, status);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.getBookingByDoctorId', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getBookingById = async (req, res) => {
    let { id } = req.params;
    try {
        let response = await bookingService.getBookingById(id);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.getBookingById', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const updateBookingResult = async (req, res) => {
    let { bookingId } = req.body;
    let result = '';
    if (req.files && req.files['result']) {
        result = req.files['result'][0].path;
    }
    try {
        let response = await bookingService.updateBookingResult(bookingId, result);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.updateBookingResult', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllSumBooking = async (req, res) => {
    try {
        let response = await bookingService.getAllSumBooking();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at BookingController.getAllSumBooking', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}
module.exports = {
    createNewBooking: createNewBooking,
    userConfirmBooking: userConfirmBooking,
    doctorConfirmBooking: doctorConfirmBooking,
    doctorRejectBooking: doctorRejectBooking,
    getBookingByUserId: getBookingByUserId,
    getBookingByDoctorId: getBookingByDoctorId,
    getBookingById: getBookingById,
    updateBookingResult: updateBookingResult,
    getAllSumBooking: getAllSumBooking
}