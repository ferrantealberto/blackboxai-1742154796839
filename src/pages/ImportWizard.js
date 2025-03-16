import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

const steps = ['Upload JSON', 'Review Data', 'Import'];

export default function ImportWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importing, setImporting] = useState(false);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        validateData(data);
        setJsonData(data);
        setActiveStep(1);
        setError('');
      } catch (error) {
        setError('Invalid JSON file: ' + error.message);
      }
    };
    reader.readAsText(file);
  }

  function validateData(data) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array of users');
    }

    data.forEach((user, index) => {
      if (!user.email) {
        throw new Error(`User at index ${index} is missing email`);
      }
      if (!user.name) {
        throw new Error(`User at index ${index} is missing name`);
      }
    });
  }

  async function handleImport() {
    setImporting(true);
    setError('');
    setSuccess('');

    try {
      for (const user of jsonData) {
        const userId = user.email.replace(/[.#$\\]/g, '_');
        await set(ref(db, `users/${userId}`), {
          ...user,
          role: user.role || 'user'
        });
      }
      setSuccess('Users imported successfully!');
      setActiveStep(2);
    } catch (error) {
      setError('Failed to import users: ' + error.message);
    } finally {
      setImporting(false);
    }
  }

  function handleReset() {
    setActiveStep(0);
    setJsonData(null);
    setError('');
    setSuccess('');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Box maxWidth="lg" margin="auto">
        <Typography variant="h4" className="mb-6">
          Import Users
        </Typography>

        <Paper className="p-6">
          <Stepper activeStep={activeStep} className="mb-8">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}

          <div className="mt-6">
            {activeStep === 0 && (
              <div className="text-center">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="json-upload"
                />
                <label htmlFor="json-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadIcon />}
                  >
                    Upload JSON File
                  </Button>
                </label>
                <Typography variant="body2" color="textSecondary" className="mt-2">
                  Upload a JSON file containing user data
                </Typography>
              </div>
            )}

            {activeStep === 1 && jsonData && (
              <div>
                <Typography variant="h6" className="mb-4">
                  Review Data ({jsonData.length} users)
                </Typography>
                <TableContainer className="mb-4">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Netlify Repo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {jsonData.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role || 'user'}</TableCell>
                          <TableCell>{user.netlifyRepo || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="flex gap-2">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleImport}
                    disabled={importing}
                  >
                    {importing ? 'Importing...' : 'Import Users'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    disabled={importing}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="text-center">
                <Typography variant="h6" className="mb-4">
                  Import Complete
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleReset}
                >
                  Import More Users
                </Button>
              </div>
            )}
          </div>
        </Paper>
      </Box>
    </div>
  );
}
