const appointmentModel = require('../models/appointmentModel');
const medicalRecordModel = require('../models/medicalRecordModel');

exports.fetchAppointments = async (doctorId) => {
    try {
        // Fetch appointments sorted by recency. You may need to ensure the model supports this.
        return await appointmentModel.getAppointmentsByDoctor(doctorId);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw new Error('Service error: Unable to fetch appointments.');
    }
};

exports.getAppointment = async (doctorId, appointmentId) => {
    try {
        const appointment = await appointmentModel.getAppointmentByDoctor(doctorId, appointmentId);
        return { error: false, data: { appointment: appointment } };
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw new Error('Service failed to cancel appointment.');
    }
};

exports.declineAppointment = async (appointmentId) => {
    try {
        // Update the appointment status to 'declined'
        await appointmentModel.updateAppointmentStatus(appointmentId, 'declined');
    } catch (error) {
        console.error('Error declining appointment:', error);
        throw new Error('Service error: Unable to decline appointment.');
    }
};

exports.fetchMedicalRecords = async (patientId, doctorId) => {
    try {
        // This function assumes there's a method to check if a doctor can access a patient's records
        const permission = await medicalRecordModel.checkDoctorPermission(patientId, doctorId);
        if (!permission) {
            return null;  // Or you could throw an error or handle it as fits your application's error handling strategy
        }
        // If permission is granted, fetch and return the medical records
        return await medicalRecordModel.getMedicalRecordsByPatient(patientId);
    } catch (error) {
        console.error('Error accessing medical records:', error);
        throw new Error('Service error: Unable to access medical records.');
    }
};

exports.downloadMedicalRecord = async (patientId, filename) => {
    return await medicalRecordModel.getMedicalRecord(patientId, filename);
};