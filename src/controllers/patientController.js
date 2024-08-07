const patientService = require('../services/patientService');

exports.listDoctors = async (req, res) => {
    try {
        console.log("Came 1")
        const { id, name, category } = req.params;
        const doctors = await patientService.listAvailableDoctors(id ,name, category);
        res.status(200).json({ error: false, data: doctors });
    } catch (error) {
        console.error('Error listing doctors:', error);
        res.status(500).json({ error: true, message: 'Failed to retrieve list of doctors.' });
    }
};

exports.bookAppointment = async (req, res) => {
    const { doctorId, date, time, description } = req.body;
    const fileName = req.file ? req.file.filename : null;
    // console.log(req.body , fileName)
    try {
        const result = await patientService.bookAppointment(req.user, doctorId, date, time, description, fileName);
        if (result.error) {
            throw new Error(result.message);
        }
        res.status(201).json({ error: false, data: { message: 'Appointment booked successfully', appointmentId: result.id } });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: true, message: error.message || 'Failed to book appointment.' });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        console.log("get all appointments")
        const result = await patientService.getAllAppointments(req.user);
        if (result.error) {
            throw new Error(result.message);
        }
        res.status(201).json(result);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: true, message: error.message || 'Failed to book appointments.' });
    }
};

exports.getAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await patientService.getAppointment(req.user, id);
        if (result.error) {
            throw new Error(result.message);
        }
        res.status(201).json({ error: false, data: { message: 'Appointments fecthed successfully', appointmentId: result.id } });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: true, message: error.message || 'Failed to book appointments.' });
    }
};

exports.cancelAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await patientService.cancelAppointment(id);
        res.status(200).json({ error: false, data: { message: 'Appointment canceled successfully' } });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ error: true, message: 'Failed to cancel appointment.' });
    }
};

exports.uploadMedicalRecord = async (req, res) => {
    const { file } = req; // Assuming file is uploaded and available as req.file
    try {
        const url = await patientService.uploadMedicalRecord(req.user.uid, file);
        res.status(201).json({ error: false, data: { message: 'Medical record uploaded successfully', url: url } });
    } catch (error) {
        console.error('Error uploading medical record:', error);
        res.status(500).json({ error: true, message: 'Failed to upload medical record.' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await patientService.getPatientDashboardStats(req.user.uid);
        res.status(200).json({ error: false, data: stats });
    } catch (error) {
        console.error('Error retrieving dashboard stats:', error);
        res.status(500).json({ error: true, message: 'Failed to retrieve dashboard statistics.' });
    }
};

exports.getProfileDetails = async (req, res) => {
    try {
        const profile = await patientService.getPatientProfile(req.user.uid);
        res.status(200).json({ error: false, data: profile });
    } catch (error) {
        console.error('Error retrieving patient profile:', error);
        res.status(500).json({ error: true, message: 'Failed to retrieve patient profile.' });
    }
};

exports.updateProfileDetails = async (req, res) => {
    const { name, dob, address } = req.body;
    try {
        await patientService.updatePatientProfile(req.user.uid, { name, dob, address });
        res.status(200).json({ error: false, data: { message: 'Profile updated successfully' } });
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ error: true, message: 'Failed to update profile.' });
    }
};

exports.getMedicalRecords = async (req, res) => {
    try {
        const records = await patientService.getMedicalRecords(req.user.uid);
        res.status(200).json({ error: false, data: records });
    } catch (error) {
        console.error('Error retrieving medical records:', error);
        res.status(500).json({ error: true, message: 'Failed to retrieve medical records.' });
    }
};

exports.downloadMedicalRecord = async (req, res) => {
    const { patientId, filename } = req.query;
    try {
        const fileStream = await patientService.downloadMedicalRecord(patientId, filename);
        fileStream.pipe(res); // Stream the file to the client
    } catch (error) {
        console.error('Error downloading medical record:', error);
        res.status(500).json({ error: true, message: 'Failed to download medical record.' });
    }
};