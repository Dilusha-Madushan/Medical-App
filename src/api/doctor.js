const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');

// Middleware to ensure the user is authenticated and is a doctor
router.use(verifyToken);



// Middleware to ensure the user is authenticated and is a patient
router.use(verifyToken);

// Set up storage engine with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

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
router.get('/appointments/all', doctorController.listAppointments);

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
router.put('/appointments/update/:id', doctorController.updateAppointment);

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

router.get('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../public/uploads', filename);
  
    res.download(filePath, (err) => {
      if (err) {
        res.status(404).json({ error: true, message: 'File not found' });
      }
    });
  });

module.exports = router;