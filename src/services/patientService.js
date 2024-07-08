const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const medicalRecordModel = require('../models/medicalRecordModel');

exports.listAvailableDoctors = async (id, name, category) => {
    try {
        return await doctorModel.getAllDoctors(id, name, category);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw new Error('Service failed to fetch doctors.');
    }
};

exports.bookAppointment = async (patientId, doctorId, date, time, file) => {
    try {
        // Convert date and time to a JavaScript Date object
        const appointmentStart = new Date(`${date}T${time}`);
        const appointmentEnd = new Date(appointmentStart.getTime() + 60 * 60000); // Adds 60 minutes

        // Check for valid operation hours: 8 AM to 8 PM, excluding 12 PM to 1 PM
        // const hour = appointmentStart.getHours();
        // if (hour < 8 || hour >= 20 || (hour >= 12 && hour < 13)) {
        //     return { error: true, message: 'Invalid appointment time. Please choose a time between 8 AM to 8 PM, excluding 12 PM to 1 PM.' };
        // }

        // Check for existing appointments that might conflict
        const conflicts = await appointmentModel.checkForConflictingAppointments(doctorId, date, appointmentStart);
        if (conflicts) {
            return { error: true, message: 'Time slot is already booked. Please choose another time.' };
        }

        let fileName;

        try {
            fileName = await medicalRecordModel.storeMedicalRecord(patientId, file);
        } catch (error) {
            console.error('Error uploading medical record:', error);
            throw new Error('Service failed to upload medical record.');
        }

        // If no conflicts and valid time, book the appointment
        const appointment = await appointmentModel.createAppointment({
            patientId,
            doctorId,
            date: appointmentStart.toISOString(),
            time: appointmentStart.toISOString(),
            endTime: appointmentEnd.toISOString(),
            status: 'pending',
            fileName: fileName
        });

        return { error: false, data: { appointmentId: appointment.id, status: appointment.status } };
    } catch (error) {
        console.error('Error booking appointment:', error);
        return { error: true, message: 'Service failed to book appointment due to an internal error.' };
    }
};

exports.cancelAppointment = async (appointmentId) => {
    try {
        await appointmentModel.updateAppointmentStatus(appointmentId, 'cancelled');
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw new Error('Service failed to cancel appointment.');
    }
};

exports.getAllAppointments = async (patientId) => {
    try {
        const appointments = await appointmentModel.getAppointmentsByPatient(patientId);
        return { error: false, data: { appointments: appointments } };
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw new Error('Service failed to cancel appointment.');
    }
};

exports.getAppointment = async (patientId, appointmentId) => {
    try {
        const appointment = await appointmentModel.getAppointmentByPatient(patientId, appointmentId);
        return { error: false, data: { appointment: appointment } };
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw new Error('Service failed to cancel appointment.');
    }
};

exports.uploadMedicalRecord = async (patientId, file) => {
    try {
        return await medicalRecordModel.storeMedicalRecord(patientId, file);
    } catch (error) {
        console.error('Error uploading medical record:', error);
        throw new Error('Service failed to upload medical record.');
    }
};

exports.getPatientDashboardStats = async (patientId) => {
    try {
        const upcomingAppointmentsCount = await appointmentModel.countAppointmentsByPatientAndStatus(patientId, 'pending');
        const totalVisits = await appointmentModel.countAppointmentsByPatientAndStatus(patientId, 'completed');
        return {
            upcomingAppointments: upcomingAppointmentsCount,
            totalVisits: totalVisits
        };
    } catch (error) {
        console.error('Error fetching patient stats:', error);
        throw new Error('Service failed to fetch dashboard statistics.');
    }
};

exports.getPatientProfile = async (patientId) => {
    try {
        return await userModel.getUserById(patientId);
    } catch (error) {
        console.error('Error retrieving patient profile:', error);
        throw new Error('Service failed to retrieve patient profile.');
    }
};

exports.updatePatientProfile = async (patientId, profileData) => {
    try {
        await userModel.updateUser(patientId, profileData);
    } catch (error) {
        console.error('Error updating patient profile:', error);
        throw new Error('Service failed to update patient profile.');
    }
};

exports.getMedicalRecords = async (patientId) => {
    return await medicalRecordModel.listMedicalRecords(patientId);
};

exports.downloadMedicalRecord = async (patientId, filename) => {
    return await medicalRecordModel.getMedicalRecord(patientId, filename);
};