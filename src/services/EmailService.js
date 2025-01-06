import nodemailer from 'nodemailer';
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Medical Booking 👻" <medicalboooking@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyEmail(dataSend), // html body
    });
}

const getBodyEmail = (dataSend) => {
    if (dataSend.relativeName) {
        return `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám cho người nhà online trên Medical Booking</p>
        <p>Thông tin người đặt lịch như sau:</p>
        <div><b>Họ và tên người đặt lịch:</b> ${dataSend.patientName}</div>
        <div><b>Số điện thoại:</b> ${dataSend.phone}</div>
        <p>Thông tin lịch hẹn của bạn như sau:</p>
        <div><b>Họ và tên bệnh nhân:</b> ${dataSend.relativeName}</div>
        <div><b>Địa chỉ:</b> ${dataSend.address}</div>
        <div><b>Số điện thoại bệnh nhân:</b> ${dataSend.relativePhone}</div>
        <div><b>Lý do khám:</b> ${dataSend.reason}</div>
        <div><b>Bác sĩ:</b> ${dataSend.doctorName}</div>
        <div><b>Thời gian khám:</b> ${dataSend.timeString}</div>
        <div><b>Địa chỉ:</b> ${dataSend.clinicName} - ${dataSend.clinicAddress}</div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng bấm vào link bên dưới để hoàn tất đặt lịch khám bệnh.</p>
        <div><a href="${process.env.CONFIRM_BOOKING_URL}/${dataSend.bookingId}">Xác nhận đặt lịch</a></div>
        <p>Trân trọng cảm ơn!</p>
        `
    }
    return `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Medical Booking</p>
        <p>Thông tin lịch hẹn của bạn như sau:</p>
        <div><b>Họ và tên bệnh nhân:</b> ${dataSend.patientName}</div>
        <div><b>Địa chỉ:</b> ${dataSend.address}</div>
        <div><b>Số điện thoại:</b> ${dataSend.phone}</div>
        <div><b>Lý do khám:</b> ${dataSend.reason}</div>
        <div><b>Bác sĩ:</b> ${dataSend.doctorName}</div>
        <div><b>Thời gian khám:</b> ${dataSend.timeString}</div>
        <div><b>Địa chỉ:</b> ${dataSend.clinicName} - ${dataSend.clinicAddress}</div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng bấm vào link bên dưới để hoàn tất đặt lịch khám bệnh.</p>
        <div><a href="${process.env.CONFIRM_BOOKING_URL}/${dataSend.bookingId}">Xác nhận đặt lịch</a></div>
        <p>Trân trọng cảm ơn!</p>
        `
}

const sendBookingConfirmResult = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Medical Booking" <medicalbooking@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        html: getBodyEmail1(dataSend), // html body
    });

}

const getBodyEmail1 = (dataSend) => {

    if (dataSend.status === 'CANCELLED') {
        return `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Đơn đặt lịch của bạn đã bị từ chối.</p>
        <p>Do và khung giờ này bệnh viện bị quá tải/Bác sĩ có việc bận nên vui lòng đặt lịch khám bệnh ở khung giờ khác/bác sĩ khác.</p>
        <p>Trân trọng cảm ơn!`

    }
    if (dataSend.status === 'CONFIRMED') {
        return `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Đơn đặt lịch của bạn đã được bác sĩ xác nhận.</p>
        <p>Vui lòng đến đúng giờ để được thăm khám.</p>
        <p>Trân trọng cảm ơn!`
    }
}

const sendConfirmDoctorResult = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Medical Booking" <medicalbooking@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        html: getBodyEmail2(dataSend), // html body
    });
}

const getBodyEmail2 = (dataSend) => {

    if (dataSend.status === 'CONFIRM') {
        return `
        <p>Bạn đã đăng ký tài khoản bác sĩ thành công!</p>
        <p>Trân trọng cảm ơn!`
    }
    if (dataSend.status === 'REJECT') {
        return `
        <p>Đơn đăng ký tài khoản bác sĩ của bạn đã bị từ chối</p>
        <p>Trân trọng cảm ơn!`
    }
}

module.exports = {
    sendSimpleEmail,
    sendBookingConfirmResult,
    sendConfirmDoctorResult,
}