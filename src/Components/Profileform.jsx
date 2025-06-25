import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import { saveProfileAPI, getProfileAPI } from '../services/allApi'; // Add these in allApi.js


const ProfileForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        education: '',
        experience: '',
        skills: ''
    });
    const [loading, setLoading] = useState(false);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;

            try {
                const response = await getProfileAPI(token);
                if (response.data) {
                    setFormData(response.data);
                }
            } catch (err) {
                console.warn("No existing profile found.");
            }
        };
        fetchProfile();
    }, [token]);


    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return toast.error("Please login first.");

        try {
            setLoading(true);
            const response = await saveProfileAPI(token, formData);
            toast.success("Profile saved!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save profile");
        } finally {
            setLoading(false);
        }
    };


    const handleDownload = () => {
        const doc = new jsPDF();
        doc.text(`Name: ${formData.name}`, 10, 10);
        doc.text(`Email: ${formData.email}`, 10, 20);
        doc.text(`Education: ${formData.education}`, 10, 30);
        doc.text(`Experience: ${formData.experience}`, 10, 40);
        doc.text(`Skills: ${formData.skills}`, 10, 50);
        doc.save('resume.pdf');
    };

    return (
        <div className="container mt-4">
            <h4>📄 Resume / Profile</h4>
            <form onSubmit={handleSubmit}>
                {['name', 'email'].map((field, i) => (
                    <div className="mb-3" key={i}>
                        <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type={field === 'email' ? 'email' : 'text'}
                            className="form-control"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                <div className="mb-3">
                    <label className="form-label">Education</label>
                    <textarea className="form-control" name="education" rows="2" value={formData.education} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Experience</label>
                    <textarea className="form-control" name="experience" rows="2" value={formData.experience} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Skills</label>
                    <input type="text" className="form-control" name="skills" value={formData.skills} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                    {loading ? 'Saving...' : '💾 Save'}
                </button>
                <button type="button" className="btn btn-success me-2" onClick={handleDownload}>
                    ⬇️ Download PDF
                </button>
            </form>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ProfileForm;
