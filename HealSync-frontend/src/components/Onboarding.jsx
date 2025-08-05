import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Listbox } from '@headlessui/react';

const steps = [
	{ id: 1, name: 'Basic Information', description: 'Personal and contact details' },
	{ id: 2, name: 'Medical Context', description: 'Your medical history and conditions' },
	{ id: 3, name: 'Lifestyle', description: 'Your habits and preferences' },
	{ id: 4, name: 'Review', description: 'Review and submit your information' }
];

const genderOptions = [
	{ value: '', label: 'Select Gender' },
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' },
	{ value: 'non-binary', label: 'Non-binary' },
	{ value: 'prefer-not-to-say', label: 'Prefer not to say' },
];
const bloodGroupOptions = [
	{ value: '', label: 'Select Blood Group' },
	{ value: 'A+', label: 'A+' },
	{ value: 'A-', label: 'A-' },
	{ value: 'B+', label: 'B+' },
	{ value: 'B-', label: 'B-' },
	{ value: 'O+', label: 'O+' },
	{ value: 'O-', label: 'O-' },
	{ value: 'AB+', label: 'AB+' },
	{ value: 'AB-', label: 'AB-' },
];

function Onboarding() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		basic: {
			fullName: '',
			dob: '',
			gender: '',
			bloodGroup: '',
			height: { value: '', unit: 'cm' },
			weight: { value: '', unit: 'kg' },
			contactNumber: '',
			emergencyContact: {
				name: '',
				number: '',
				relation: ''
			}
		},
		medical: {
			chronicConditions: [],
			allergies: [],
			currentMedications: [],
			disabilities: [],
			vision: {
				leftEye: '',
				rightEye: '',
				wearsGlasses: false
			},
			hearingAids: false
		}
	});

	const handleBasicInfoChange = (e) => {
		const { name, value } = e.target;
		if (name.includes('.')) {
			const [parent, child] = name.split('.');
			setFormData(prev => ({
				...prev,
				basic: {
					...prev.basic,
					[parent]: {
						...prev.basic[parent],
						[child]: value
					}
				}
			}));
		} else {
			setFormData(prev => ({
				...prev,
				basic: {
					...prev.basic,
					[name]: value
				}
			}));
		}
	};

	const validateBasicInfo = () => {
		const newErrors = {};
		const { basic } = formData;

		if (!basic.fullName) newErrors.fullName = 'Full name is required';
		if (!basic.dob) newErrors.dob = 'Date of birth is required';
		if (!basic.gender) newErrors.gender = 'Gender is required';
		if (!basic.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
		if (!basic.height.value) newErrors.height = 'Height is required';
		if (!basic.weight.value) newErrors.weight = 'Weight is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = async () => {
		if (currentStep === 1 && !validateBasicInfo()) {
			return;
		}

		if (currentStep === 2 && !validateMedicalInfo()) {
			return;
		}

		try {
			setLoading(true);
			let endpoint = 'http://localhost:3000/api/user/onboarding';
			let data = {};

			if (currentStep === 1) {
				data = { basic: formData.basic };
			} else if (currentStep === 2) {
				endpoint = 'http://localhost:3000/api/user/profile';
				data = { medical: formData.medical };
			}

			console.log('Sending data to:', endpoint, data);
			
			const response = await fetch(endpoint, {
				method: currentStep === 1 ? 'POST' : 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${await user.getIdToken()}`
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || `Failed to save ${currentStep === 1 ? 'basic' : 'medical'} information`);
			}

			const responseData = await response.json();
			console.log('Success response:', responseData);
			
			setCurrentStep(prev => prev + 1);
		} catch (error) {
			console.error('Error saving data:', error);
			setErrors({ submit: error.message });
		} finally {
			setLoading(false);
		}
	};

	const handleMedicalInfoChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			medical: {
				...prev.medical,
				[name]: type === 'checkbox' ? checked : value
			}
		}));
	};

	const handleArrayFieldChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			medical: {
				...prev.medical,
				[field]: value
			}
		}));
	};

	const validateMedicalInfo = () => {
		const newErrors = {};
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const inputClassName = (error) => `
		mt-1 block w-full rounded-lg 
		bg-background dark:bg-accent-20 
		border-accent/20 
		shadow-sm 
		focus:border-primary focus:ring-primary 
		sm:text-sm 
		transition-colors
		${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
	`.trim();

	const dropdownClassName = (error) => `
		mt-1 block w-full rounded-lg 
		bg-background dark:bg-accent-20 
		border-accent/20 
		shadow-sm 
		focus:border-primary focus:ring-primary 
		sm:text-sm 
		transition-colors
		text-text dark:text-text 
		${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
	`.trim();

	const optionClassName = `
		text-text dark:text-text 
		bg-background dark:bg-accent-20 
	`.trim();

	const selectClassName = (error) => `
		mt-1 block w-full rounded-lg 
		bg-background dark:bg-accent-20 
		border-accent/20 
		shadow-sm 
		focus:border-primary focus:ring-primary 
		sm:text-sm 
		transition-colors
		${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
	`.trim();

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-6">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div>
								<label className="block text-sm font-medium text-text">
									Full Name *
								</label>
								<input
									type="text"
									name="fullName"
									value={formData.basic.fullName}
									onChange={handleBasicInfoChange}
									className={inputClassName(errors.fullName)}
								/>
								{errors.fullName && (
									<p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-text">
									Date of Birth *
								</label>
								<input
									type="date"
									name="dob"
									value={formData.basic.dob}
									onChange={handleBasicInfoChange}
									className={inputClassName(errors.dob)}
								/>
								{errors.dob && (
									<p className="mt-1 text-sm text-red-600">{errors.dob}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-text mb-1">
									Gender *
								</label>
								<Listbox
									value={formData.basic.gender}
									onChange={val => handleBasicInfoChange({ target: { name: 'gender', value: val } })}
								>
									<div className="relative">
										<Listbox.Button className={`w-full rounded-lg border border-accent/20 bg-background dark:bg-accent-20 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-text dark:text-text ${errors.gender ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}> 
											{genderOptions.find(opt => opt.value === formData.basic.gender)?.label || 'Select Gender'}
										</Listbox.Button>
										<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-accent-20 border-accent-20 py-1 text-base shadow-lg ring-1 ring-black/10 focus:outline-none sm:text-sm">
											{genderOptions.map(option => (
												<Listbox.Option
													key={option.value}
													value={option.value}
													className={({ active, selected }) =>
														`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
															active ? 'bg-primary/10 text-primary' : 'text-text dark:text-text'
														} ${selected ? 'font-semibold' : 'font-normal'}`
													}
												>
													{option.label}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</div>
								</Listbox>
								{errors.gender && (
									<p className="mt-1 text-sm text-red-600">{errors.gender}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-text mb-1">
									Blood Group *
								</label>
								<Listbox
									value={formData.basic.bloodGroup}
									onChange={val => handleBasicInfoChange({ target: { name: 'bloodGroup', value: val } })}
								>
									<div className="relative">
										<Listbox.Button className={`w-full rounded-lg border border-accent/20 bg-background dark:bg-accent-20 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-text dark:text-text ${errors.bloodGroup ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}> 
											{bloodGroupOptions.find(opt => opt.value === formData.basic.bloodGroup)?.label || 'Select Blood Group'}
										</Listbox.Button>
										<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-accent-20 py-1 text-base shadow-lg ring-1 ring-black/10 focus:outline-none sm:text-sm">
											{bloodGroupOptions.map(option => (
												<Listbox.Option
													key={option.value}
													value={option.value}
													className={({ active, selected }) =>
														`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
															active ? 'bg-primary/10 text-primary' : 'text-text dark:text-text'
														} ${selected ? 'font-semibold' : 'font-normal'}`
													}
												>
													{option.label}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</div>
								</Listbox>
								{errors.bloodGroup && (
									<p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-text">
									Height *
								</label>
								<div className="mt-1 flex">
									<input
										type="number"
										name="height.value"
										value={formData.basic.height.value}
										onChange={handleBasicInfoChange}
										className={`${inputClassName(errors.height)} rounded-r-none`}
									/>
									<select
										name="height.unit"
										value={formData.basic.height.unit}
										onChange={handleBasicInfoChange}
										className="rounded-l-none rounded-r-lg border-l-0 border-accent/20 bg-surface dark:bg-accent-10"
									>
										<option value="cm">cm</option>
										<option value="ft">ft</option>
									</select>
								</div>
								{errors.height && (
									<p className="mt-1 text-sm text-red-600">{errors.height}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-text">
									Weight *
								</label>
								<div className="mt-1 flex">
									<input
										type="number"
										name="weight.value"
										value={formData.basic.weight.value}
										onChange={handleBasicInfoChange}
										className={`${inputClassName(errors.weight)} rounded-r-none`}
									/>
									<select
										name="weight.unit"
										value={formData.basic.weight.unit}
										onChange={handleBasicInfoChange}
										className="rounded-l-none rounded-r-lg border-l-0 border-accent/20 bg-surface dark:bg-accent-10"
									>
										<option value="kg">kg</option>
										<option value="lbs">lbs</option>
									</select>
								</div>
								{errors.weight && (
									<p className="mt-1 text-sm text-red-600">{errors.weight}</p>
								)}
							</div>
						</div>

						{errors.submit && (
							<p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 rounded-md p-3">
								{errors.submit}
							</p>
						)}

						<div className="flex justify-end space-x-4 mt-8">
							<button
								type="button"
								onClick={handleNext}
								disabled={loading}
								className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
							>
								{loading ? 'Saving...' : 'Next'}
							</button>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-6">
						{/* Chronic Conditions */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Chronic Conditions
							</label>
							<div className="flex flex-wrap gap-2">
								{formData.medical.chronicConditions.map((condition, index) => (
									<span
										key={index}
										className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:text-primary dark:bg-accent-20 border border-primary/20"
									>
										{condition}
										<button
											type="button"
											onClick={() => {
												const newConditions = [...formData.medical.chronicConditions];
												newConditions.splice(index, 1);
												handleArrayFieldChange('chronicConditions', newConditions);
											}}
											className="ml-2 text-primary hover:text-primary/80"
										>
											×
										</button>
									</span>
								))}
							</div>
							<div className="mt-2 flex">
								<input
									type="text"
									placeholder="Type and press Enter to add"
									className="flex-1 rounded-md bg-background dark:bg-accent-20 border-accent/20 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
									onKeyPress={(e) => {
										if (e.key === 'Enter' && e.target.value.trim()) {
											e.preventDefault();
											handleArrayFieldChange('chronicConditions', [
												...formData.medical.chronicConditions,
												e.target.value.trim()
											]);
											e.target.value = '';
										}
									}}
								/>
							</div>
						</div>

						{/* Allergies */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Allergies
							</label>
							<div className="flex flex-wrap gap-2">
								{formData.medical.allergies.map((allergy, index) => (
									<span
										key={index}
										className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:text-primary dark:bg-accent-20 border border-primary/20"
									>
										{allergy}
										<button
											type="button"
											onClick={() => {
												const newAllergies = [...formData.medical.allergies];
												newAllergies.splice(index, 1);
												handleArrayFieldChange('allergies', newAllergies);
											}}
											className="ml-2 text-primary hover:text-primary/80"
										>
											×
										</button>
									</span>
								))}
							</div>
							<div className="mt-2 flex">
								<input
									type="text"
									placeholder="Type and press Enter to add"
									className="flex-1 rounded-md bg-background dark:bg-accent-20 border-accent/20 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
									onKeyPress={(e) => {
										if (e.key === 'Enter' && e.target.value.trim()) {
											e.preventDefault();
											handleArrayFieldChange('allergies', [
												...formData.medical.allergies,
												e.target.value.trim()
											]);
											e.target.value = '';
										}
									}}
								/>
							</div>
						</div>

						{/* Current Medications */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Current Medications
							</label>
							<div className="flex flex-wrap gap-2">
								{formData.medical.currentMedications.map((medication, index) => (
									<span
										key={index}
										className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:text-primary dark:bg-accent-20 border border-primary/20"
									>
										{medication}
										<button
											type="button"
											onClick={() => {
												const newMedications = [...formData.medical.currentMedications];
												newMedications.splice(index, 1);
												handleArrayFieldChange('currentMedications', newMedications);
											}}
											className="ml-2 text-primary hover:text-primary/80"
										>
											×
										</button>
									</span>
								))}
							</div>
							<div className="mt-2 flex">
								<input
									type="text"
									placeholder="Type and press Enter to add"
									className="flex-1 rounded-md bg-background dark:bg-accent-20 border-accent/20 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
									onKeyPress={(e) => {
										if (e.key === 'Enter' && e.target.value.trim()) {
											e.preventDefault();
											handleArrayFieldChange('currentMedications', [
												...formData.medical.currentMedications,
												e.target.value.trim()
											]);
											e.target.value = '';
										}
									}}
								/>
							</div>
						</div>

						{/* Vision */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Left Eye Vision
								</label>
								<input
									type="text"
									name="vision.leftEye"
									value={formData.medical.vision.leftEye}
									onChange={handleMedicalInfoChange}
									placeholder="e.g., 6/6"
									className="mt-1 block w-full rounded-md bg-background dark:bg-accent-20 border-accent/20 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Right Eye Vision
								</label>
								<input
									type="text"
									name="vision.rightEye"
									value={formData.medical.vision.rightEye}
									onChange={handleMedicalInfoChange}
									placeholder="e.g., 6/6"
									className="mt-1 block w-full rounded-md bg-background dark:bg-accent-20 border-accent/20 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
							</div>
						</div>

						<div>
							<div className="relative flex items-start">
								<div className="flex h-5 items-center">
									<input
										type="checkbox"
										name="wearsGlasses"
										checked={formData.medical.vision.wearsGlasses}
										onChange={handleMedicalInfoChange}
										className="h-4 w-4 rounded border-accent/20 text-primary focus:ring-primary"
									/>
								</div>
								<div className="ml-3 text-sm">
									<label htmlFor="wearsGlasses" className="font-medium text-text">
										Wears Glasses/Contact Lenses
									</label>
								</div>
							</div>
						</div>

						<div>
							<div className="relative flex items-start">
								<div className="flex h-5 items-center">
									<input
										type="checkbox"
										name="hearingAids"
										checked={formData.medical.hearingAids}
										onChange={handleMedicalInfoChange}
										className="h-4 w-4 rounded border-accent/20 text-primary focus:ring-primary"
									/>
								</div>
								<div className="ml-3 text-sm">
									<label htmlFor="hearingAids" className="font-medium text-text">
										Uses Hearing Aids
									</label>
								</div>
							</div>
						</div>

						{/* Disabilities */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Disabilities or Special Needs
							</label>
							<div className="flex flex-wrap gap-2">
								{formData.medical.disabilities.map((disability, index) => (
									<span
										key={index}
										className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:text-primary dark:bg-accent-20 border border-primary/20"
									>
										{disability}
										<button
											type="button"
											onClick={() => {
												const newDisabilities = [...formData.medical.disabilities];
												newDisabilities.splice(index, 1);
												handleArrayFieldChange('disabilities', newDisabilities);
											}}
											className="ml-2 text-primary hover:text-primary/80"
										>
											×
										</button>
									</span>
								))}
							</div>
							<div className="mt-2 flex">
								<input
									type="text"
									placeholder="Type and press Enter to add"
									className="flex-1 rounded-md bg-background dark:bg-accent-20 border-accent/20 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
									onKeyPress={(e) => {
										if (e.key === 'Enter' && e.target.value.trim()) {
											e.preventDefault();
											handleArrayFieldChange('disabilities', [
												...formData.medical.disabilities,
												e.target.value.trim()
											]);
											e.target.value = '';
										}
									}}
								/>
							</div>
						</div>

						{errors.submit && (
							<p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 rounded-md p-3">
								{errors.submit}
							</p>
						)}

						<div className="flex justify-end space-x-4 mt-8">
							<button
								type="button"
								onClick={() => setCurrentStep(prev => prev - 1)}
								className="inline-flex justify-center rounded-lg border border-accent/20 bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
							>
								Back
							</button>
							<button
								type="button"
								onClick={handleNext}
								disabled={loading}
								className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
							>
								{loading ? 'Saving...' : currentStep === steps.length ? 'Submit' : 'Next'}
							</button>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				{/* Progress Steps */}
				<nav aria-label="Progress">
					<ol className="flex items-center justify-between mb-8">
						{steps.map((step, stepIdx) => (
							<li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
								<div className="flex items-center">
									<div
										className={`${
											currentStep >= step.id
												? 'bg-primary border-primary text-background'
												: 'bg-surface border-accent/20 text-text'
										} rounded-full border-2 flex items-center justify-center h-8 w-8`}
									>
										{currentStep > step.id ? (
											<span>✓</span>
										) : (
											<span>
												{step.id}
											</span>
										)}
									</div>
									<div className="ml-4 min-w-0 flex flex-col">
										<span className="text-xs font-semibold tracking-wide uppercase text-text">
											{step.name}
										</span>
										<span className="text-sm text-text/60">{step.description}</span>
									</div>
								</div>
								{stepIdx !== steps.length - 1 && (
									<div className="hidden sm:block absolute top-4 right-4 w-full h-0.5 bg-accent/20" />
								)}
							</li>
						))}
					</ol>
				</nav>

				{/* Form Content */}
				<div className="bg-surface dark:bg-accent-10 shadow-lg border border-accent/10 rounded-2xl p-6">
					<h2 className="text-2xl font-bold text-primary dark:text-primary mb-6">
						{steps[currentStep - 1].name}
					</h2>
					{renderStepContent()}
				</div>
			</div>
		</div>
	);
}

export default Onboarding;