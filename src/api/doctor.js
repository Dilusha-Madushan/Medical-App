const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Middleware to ensure the user is authenticated and is a doctor
router.use(verifyToken, requireRole('doctor'));

/**
 * @openapi
 * /doctors/appointments:
 *   get:
 *     tags:
 *       - Doctors
 *     summary: List all appointments sorted by recency
 *     description: Retrieve a list of all appointments associated with the logged-in doctor, sorted by the most recent.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized if the user is not authenticated.
 *       403:
 *         description: Forbidden if the user is not a doctor.
 */
router.get('/appointments', doctorController.listAppointments);

/**
 * @openapi
 * /doctors/appointments/decline/{id}:
 *   put:
 *     tags:
 *       - Doctors
 *     summary: Decline an appointment
 *     description: Allow a doctor to decline a specific appointment before the set time.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment to decline.
 *     responses:
 *       200:
 *         description: Appointment declined successfully.
 *       400:
 *         description: Bad request if ID is missing or invalid.
 *       401:
 *         description: Unauthorized if the user is not authenticated.
 *       403:
 *         description: Forbidden if the user is not a doctor.
 */
router.put('/appointments/decline/:id', doctorController.updateAppointment);

/**
 * @openapi
 * /doctors/medical-records/{patientId}:
 *   get:
 *     tags:
 *       - Doctors
 *     summary: Access medical reports
 *     description: View and download medical reports of a patient, if permitted.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The patient ID whose medical records are to be accessed.
 *     responses:
 *       200:
 *         description: Medical records retrieved successfully.
 *       400:
 *         description: Bad request if patient ID is missing or invalid.
 *       401:
 *         description: Unauthorized if the user is not authenticated.
 *       403:
 *         description: Forbidden if the user is not a doctor or does not have permission to access the records.
 */
router.get('/medical-records/:patientId', doctorController.accessMedicalRecords);

router.get('/appointments/:id', doctorController.getAppointment);

router.get('/medical-records/download', doctorController.downloadMedicalRecord);

module.exports = router;