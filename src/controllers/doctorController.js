const doctorService = require('../services/doctorService');

exports.listAppointments = async (req, res) => {
    try {
        const appointments = await doctorService.fetchAppointments(req.user);
        res.status(200).json({ error: false, data: appointments });
    } catch (error) {
        console.error('Error listing appointments:', error);
        res.status(500).json({ error: true, message: 'Failed to retrieve appointments.' });
    }
};

exports.getAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await doctorService.getAppointment(req.user, id);
        if (result.error) {
            throw new Error(result.message);
        }
        res.status(201).json({ error: false, data: { message: 'Appointments fecthed successfully', appointmentId: result.id } });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: true, message: error.message || 'Failed to book appointments.' });
    }
};

exports.updateAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await doctorService.declineAppointment(id);
        res.status(200).json({ error: false, data: { message: 'Appointment declined successfully.' } });
    } catch (error) {
        console.error('Error declining appointment:', error);
        res.status(500).json({ error: true, message: 'Failed to decline appointment.' });
    }
};

exports.accessMedicalRecords = async (req, res) => {
    const { patientId } = req.params;
    try {
        const records = await doctorService.fetchMedicalRecords(patientId, req.user.id);
        if (!records) {
            res.status(403).json({ error: true, message: 'Access to medical records denied.' });
        } else {
            res.status(200).json({ error: false, data: records });
        }
    } catch (error) {
        console.error('Error accessing medical records:', error);
        res.status(500).json({ error: true, message: 'Failed to retrieve medical records.' });
    }
};

exports.downloadMedicalRecord = async (req, res) => {
    const { patientId, filename } = req.query;
    try {
        const fileStream = await doctorService.downloadMedicalRecord(patientId, filename);
        fileStream.pipe(res); // Stream the file to the client
    } catch (error) {
        console.error('Error downloading medical record:', error);
        res.status(500).json({ error: true, message: 'Failed to download medical record.' });
    }
};