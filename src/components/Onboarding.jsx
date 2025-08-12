import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Listbox } from '@headlessui/react';
import { addUserProfile } from '../utils/firestoreService';

const steps = [
	{ id: 1, name: 'Basic Information', description: 'Personal and contact details' },
	{ id: 2, name: 'Medical Context', description: 'Your medical history and conditions' },
	{ id: 3, name: 'Lifestyle', description: 'Your habits and preferences' },
	// Removed the 4th step
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


const habitOptions = [
	'Regular Exercise',
	'Smoking',
	'Drinking Alcohol',
	'Meditation',
	'Yoga',
	'Running/Jogging',
	'Swimming',
	'Cycling',
	'Weight Training',
	'Walking',
	'Late Night Sleep',
	'Early Morning Routine',
	'Screen Time (High)',
	'Reading',
	'Gaming'
];

const preferenceOptions = [
	'Vegetarian',
	'Vegan',
	'Non-Vegetarian',
	'Gluten-Free',
	'Low Sugar',
	'No Dairy',
	'Organic Food',
	'Home Cooked Meals',
	'Fast Food',
	'Spicy Food',
	'Low Sodium',
	'High Protein Diet'
];

// Medical context options
const chronicConditionsOptions = [
	'High Blood Pressure',
	'Diabetes Type 1',
	'Diabetes Type 2',
	'Asthma',
	'Heart Disease',
	'Cancer',
	'Stroke',
	'Arthritis',
	'Depression',
	'Anxiety',
	'COPD',
	'Kidney Disease',
	'Liver Disease',
	'Thyroid Disorder',
	'Migraine',
	'Epilepsy',
	'Fibromyalgia',
	'Chronic Fatigue Syndrome',
	'Osteoporosis',
	'Bipolar Disorder',
	'Schizophrenia',
	'Multiple Sclerosis',
	'Parkinson\'s Disease',
	'Alzheimer\'s Disease',
	'IBS',
	'Crohn\'s Disease',
	'Ulcerative Colitis',
	'Celiac Disease'
];

const allergiesOptions = [
	'Penicillin',
	'Sulfa Drugs',
	'NSAIDs',
	'Aspirin',
	'Latex',
	'Peanuts',
	'Tree Nuts',
	'Milk',
	'Eggs',
	'Wheat',
	'Soy',
	'Fish',
	'Shellfish',
	'Pollen',
	'Dust Mites',
	'Pet Dander',
	'Mold',
	'Bee Stings',
	'Contrast Dye'
];

const medicationsOptions = [
	'Lisinopril',
	'Atorvastatin',
	'Levothyroxine',
	'Metformin',
	'Amlodipine',
	'Metoprolol',
	'Omeprazole',
	'Simvastatin',
	'Losartan',
	'Albuterol',
	'Gabapentin',
	'Hydrochlorothiazide',
	'Sertraline',
	'Acetaminophen',
	'Ibuprofen',
	'Fluoxetine',
	'Amoxicillin',
	'Prednisone',
	'Escitalopram',
	'Tramadol',
	'Furosemide',
	'Antihypertensives',
	'Antidiabetics',
	'Statins',
	'Anticoagulants',
	'Beta Blockers',
	'Antidepressants',
	'Antibiotics',
	'Pain Relievers',
	'Anti-inflammatories',
	'Antihistamines',
	'Inhalers',
	'Thyroid Medications',
	'Vitamins & Supplements'
];

const disabilitiesOptions = [
	'Mobility Impairment',
	'Visual Impairment',
	'Hearing Impairment',
	'Speech Impairment',
	'Cognitive Disability',
	'Intellectual Disability',
	'Learning Disability',
	'Neurological Disability',
	'Psychiatric Disability',
	'Developmental Disability',
	'Wheelchair User',
	'Prosthetic User',
	'Amputee',
	'Multiple Sclerosis',
	'Cerebral Palsy',
	'Spinal Cord Injury',
	'Neurological Disorder',
	'Chronic Pain',
	'Missing Limb'
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
		},
		lifestyle: {
			habits: [],
			preferences: []
		},
		onboardingCompleted: false // Default value of the flag
	});

	useEffect(() => {
		if (user && user.onboarding === true) {
			navigate('/user');
		}
	}, [user, navigate]);

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

		if (currentStep === 3 && !validateLifestyleInfo()) {
			return;
		}

		try {
			setLoading(true);

			// Incremental updates per step using Firestore merge
			const payload =
				currentStep === 1
					? { basic: formData.basic, onboardingCompleted: true }  // Added onboardingCompleted flag after basic profile is submitted
					: currentStep === 2
					? { medical: formData.medical }
					: currentStep === 3
					? { lifestyle: formData.lifestyle }
					: {};

				console.log('User ID', user?.uid);
				console.log('Payload:', payload);

			if (user?.uid && Object.keys(payload).length > 0) {
				const res = await addUserProfile(user.uid, payload);
				if (!res.success) throw new Error(res.error || 'Failed to save profile');
			}

			// After successful save, move to next step
			if (currentStep === 3) {
				// After last step, redirect to user dashboard
				navigate('/user');
				return;
			}
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

	const handleLifestyleChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			lifestyle: {
				...prev.lifestyle,
				[field]: value
			}
		}));
	};

	const validateMedicalInfo = () => {
		const newErrors = {};
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateLifestyleInfo = () => {
		const newErrors = {};
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const inputClassName = (error) => `
		mt-2 block w-full rounded-xl 
		bg-white dark:bg-gray-800 
		border-2 border-gray-200 dark:border-gray-700
		shadow-sm 
		focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900
		px-4 py-3
		text-sm font-medium
		transition-all duration-200
		placeholder-gray-400 dark:placeholder-gray-500
		${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-red-100' : ''}
	`.trim();

	const selectableItemClassName = (isSelected) => `
		px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
		text-sm font-medium text-center
		${isSelected 
			? 'bg-blue-500 border-blue-500 text-white shadow-lg transform scale-105' 
			: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700'
		}
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
					<div className="space-y-8">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="sm:col-span-2">
								<label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
									Full Name *
								</label>
								<input
									type="text"
									name="fullName"
									value={formData.basic.fullName}
									onChange={handleBasicInfoChange}
									placeholder="Enter your full name"
									className={inputClassName(errors.fullName)}
								/>
								{errors.fullName && (
									<p className="mt-2 text-sm text-red-600 flex items-center">
										<span className="mr-1">⚠️</span> {errors.fullName}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
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
									<p className="mt-2 text-sm text-red-600 flex items-center">
										<span className="mr-1">⚠️</span> {errors.dob}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
									Gender *
								</label>
								<Listbox
									value={formData.basic.gender}
									onChange={val => handleBasicInfoChange({ target: { name: 'gender', value: val } })}
								>
									<div className="relative">
										<Listbox.Button className={`w-full rounded-xl border-2 bg-white dark:bg-gray-800 px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200 ${errors.gender ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'}`}> 
											<span className={formData.basic.gender ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
												{genderOptions.find(opt => opt.value === formData.basic.gender)?.label || 'Select Gender'}
											</span>
										</Listbox.Button>
										<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
											{genderOptions.slice(1).map(option => (
												<Listbox.Option
													key={option.value}
													value={option.value}
													className={({ active, selected }) =>
														`cursor-pointer select-none px-4 py-3 text-sm font-medium ${
															active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white'
														} ${selected ? 'bg-blue-100 dark:bg-blue-900' : ''}`
													}
												>
													{option.label}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</div>
								</Listbox>
								{errors.gender && (
									<p className="mt-2 text-sm text-red-600 flex items-center">
										<span className="mr-1">⚠️</span> {errors.gender}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
									Blood Group *
								</label>
								<Listbox
									value={formData.basic.bloodGroup}
									onChange={val => handleBasicInfoChange({ target: { name: 'bloodGroup', value: val } })}
								>
									<div className="relative">
										<Listbox.Button className={`w-full rounded-xl border-2 bg-white dark:bg-gray-800 px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200 ${errors.bloodGroup ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'}`}> 
											<span className={formData.basic.bloodGroup ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
												{bloodGroupOptions.find(opt => opt.value === formData.basic.bloodGroup)?.label || 'Select Blood Group'}
											</span>
										</Listbox.Button>
										<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
											{bloodGroupOptions.slice(1).map(option => (
												<Listbox.Option
													key={option.value}
													value={option.value}
													className={({ active, selected }) =>
														`cursor-pointer select-none px-4 py-3 text-sm font-medium ${
															active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white'
														} ${selected ? 'bg-blue-100 dark:bg-blue-900' : ''}`
													}
												>
													{option.label}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</div>
								</Listbox>
								{errors.bloodGroup && (
									<p className="mt-2 text-sm text-red-600 flex items-center">
										<span className="mr-1">⚠️</span> {errors.bloodGroup}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
									Height *
								</label>
								<div className="flex gap-2">
									<input
										type="number"
										name="height.value"
										value={formData.basic.height.value}
										onChange={handleBasicInfoChange}
										placeholder="165"
										className={`${inputClassName(errors.height)} flex-1`}
									/>
									<select
										name="height.unit"
										value={formData.basic.height.unit}
										onChange={handleBasicInfoChange}
										className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium w-20"
									>
										<option value="cm">cm</option>
										<option value="ft">ft</option>
									</select>
								</div>
								{errors.height && (
									<p className="mt-2 text-sm text-red-600 flex items-center">
										<span className="mr-1">⚠️</span> {errors.height}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
									Weight *
								</label>
								<div className="flex gap-2">
									<input
										type="number"
										name="weight.value"
										value={formData.basic.weight.value}
										onChange={handleBasicInfoChange}
										placeholder="70"
										className={`${inputClassName(errors.weight)} flex-1`}
									/>
									<select
										name="weight.unit"
										value={formData.basic.weight.unit}
										onChange={handleBasicInfoChange}
										className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium w-20"
									>
										<option value="kg">kg</option>
										<option value="lbs">lbs</option>
									</select>
								</div>
								{errors.weight && (
									<p className="mt-2 text-sm text-red-600 flex items-center">
										<span className="mr-1">⚠️</span> {errors.weight}
									</p>
								)}
							</div>
						</div>

						{errors.submit && (
							<div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
								<p className="text-sm text-red-600 dark:text-red-400 flex items-center">
									<span className="mr-2">❌</span> {errors.submit}
								</p>
							</div>
						)}

						<div className="flex justify-end pt-6">
							<button
								type="button"
								onClick={handleNext}
								disabled={loading}
								className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
							>
								{loading ? (
									<span className="flex items-center">
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Saving...
									</span>
								) : (
									'Next Step →'
								)}
							</button>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-8">
						{/* Habits Section */}
						<div>
							<label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
								🏃‍♂️ Your Habits
							</label>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
								Select all habits that apply to you. This helps us provide better recommendations.
							</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
								{habitOptions.map(habit => (
									<button
										key={habit}
										type="button"
										onClick={() => {
											const currentHabits = formData.lifestyle.habits;
											const newHabits = currentHabits.includes(habit)
												? currentHabits.filter(h => h !== habit)
												: [...currentHabits, habit];
											handleLifestyleChange('habits', newHabits);
										}}
										className={selectableItemClassName(formData.lifestyle.habits.includes(habit))}
									>
										{habit}
									</button>
								))}
							</div>
						</div>

						{/* Preferences Section */}
						<div>
							<label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
								🍽️ Dietary Preferences
							</label>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
								Select your dietary preferences and restrictions.
							</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
								{preferenceOptions.map(preference => (
									<button
										key={preference}
										type="button"
										onClick={() => {
											const currentPreferences = formData.lifestyle.preferences;
											const newPreferences = currentPreferences.includes(preference)
												? currentPreferences.filter(p => p !== preference)
												: [...currentPreferences, preference];
											handleLifestyleChange('preferences', newPreferences);
										}}
										className={selectableItemClassName(formData.lifestyle.preferences.includes(preference))}
									>
										{preference}
									</button>
								))}
							</div>
						</div>

						{errors.submit && (
							<div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
								<p className="text-sm text-red-600 dark:text-red-400 flex items-center">
									<span className="mr-2">❌</span> {errors.submit}
								</p>
							</div>
						)}

						<div className="flex justify-between pt-6">
							<button
								type="button"
								onClick={() => setCurrentStep(prev => prev - 1)}
								className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
							>
								← Back
							</button>
							<button
								type="button"
								onClick={handleNext}
								disabled={loading}
								className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
							>
								{loading ? (
									<span className="flex items-center">
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Saving...
									</span>
								) : (
									'Next Step →'
								)}
							</button>
						</div>
					</div>
				);

			// Medical Context section
			case 2:
				return (
					<div className="space-y-8">
						{/* Chronic Conditions Section - Multi-select dropdown */}
						<div>
							<label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
								🩺 Chronic Conditions
							</label>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
								Select any chronic conditions you have been diagnosed with.
							</p>
							
							<Listbox
								value={formData.medical.chronicConditions}
								onChange={(selected) => handleArrayFieldChange('chronicConditions', selected)}
								multiple
							>
								{({ open }) => (
									<div className="relative mt-1">
										<Listbox.Button className="w-full rounded-xl border-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200">
											<span className={formData.medical.chronicConditions.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
												{formData.medical.chronicConditions.length > 0
													? formData.medical.chronicConditions.length > 2
														? `${formData.medical.chronicConditions[0]}, ${formData.medical.chronicConditions[1]}, +${formData.medical.chronicConditions.length - 2} more`
														: formData.medical.chronicConditions.join(', ')
													: 'Select chronic conditions'}
											</span>
											<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
													<path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</span>
										</Listbox.Button>

										<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
											<div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-2 py-2">
												<input
													type="text"
													placeholder="Search conditions..."
													className="w-full px-3 py-2 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
													onKeyDown={(e) => {
														if (e.key === 'Enter' && e.target.value.trim()) {
															e.preventDefault();
															const newCondition = e.target.value.trim();
															if (!formData.medical.chronicConditions.includes(newCondition)) {
																handleArrayFieldChange('chronicConditions', [...formData.medical.chronicConditions, newCondition]);
															}
															e.target.value = '';
														}
													}}
												/>
											</div>
											<div className="pt-1">
												{chronicConditionsOptions.map((condition) => (
													<Listbox.Option
														key={condition}
														value={condition}
														className={({ active, selected }) =>
															`cursor-pointer select-none relative py-3 px-4 ${
																active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'text-gray-900 dark:text-white'
															}`
														}
													>
														{({ selected, active }) => (
															<div className="flex items-center justify-between">
																<span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
																	{condition}
																</span>
																{selected && (
																	<span className="text-blue-600 dark:text-blue-400">
																		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
																			<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																		</svg>
																	</span>
																)}
															</div>
														)}
													</Listbox.Option>
												))}
											</div>
										</Listbox.Options>
									</div>
								)}
							</Listbox>

							{formData.medical.chronicConditions.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{formData.medical.chronicConditions.map((condition, index) => (
										<div 
											key={index} 
											className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-lg flex items-center text-sm font-medium"
										>
											{condition}
											<button
												type="button"
												className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none"
												onClick={() => {
													const updatedConditions = formData.medical.chronicConditions.filter((_, i) => i !== index);
													handleArrayFieldChange('chronicConditions', updatedConditions);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Allergies Section - Multi-select dropdown */}
						<div>
							<label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
								⚠️ Allergies
							</label>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
								Select any allergies you have.
							</p>
							
							<Listbox
								value={formData.medical.allergies}
								onChange={(selected) => handleArrayFieldChange('allergies', selected)}
								multiple
							>
								{({ open }) => (
									<div className="relative mt-1">
										<Listbox.Button className="w-full rounded-xl border-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200">
											<span className={formData.medical.allergies.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
												{formData.medical.allergies.length > 0
													? formData.medical.allergies.length > 2
														? `${formData.medical.allergies[0]}, ${formData.medical.allergies[1]}, +${formData.medical.allergies.length - 2} more`
														: formData.medical.allergies.join(', ')
													: 'Select allergies'}
											</span>
											<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
													<path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</span>
										</Listbox.Button>

										<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
											<div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-2 py-2">
												<input
													type="text"
													placeholder="Search allergies or add new..."
													className="w-full px-3 py-2 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
													onKeyDown={(e) => {
														if (e.key === 'Enter' && e.target.value.trim()) {
															e.preventDefault();
															const newAllergy = e.target.value.trim();
															if (!formData.medical.allergies.includes(newAllergy)) {
																handleArrayFieldChange('allergies', [...formData.medical.allergies, newAllergy]);
															}
															e.target.value = '';
														}
													}}
												/>
											</div>
											<div className="pt-1">
												{allergiesOptions.map((allergy) => (
													<Listbox.Option
														key={allergy}
														value={allergy}
														className={({ active, selected }) =>
															`cursor-pointer select-none relative py-3 px-4 ${
																active ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 'text-gray-900 dark:text-white'
															}`
														}
													>
														{({ selected, active }) => (
															<div className="flex items-center justify-between">
																<span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
																	{allergy}
																</span>
																{selected && (
																	<span className="text-red-600 dark:text-red-400">
																		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
																			<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																		</svg>
																	</span>
																)}
															</div>
														)}
													</Listbox.Option>
												))}
											</div>
										</Listbox.Options>
									</div>
								)}
							</Listbox>

							{formData.medical.allergies.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{formData.medical.allergies.map((allergy, index) => (
										<div 
											key={index} 
											className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1.5 rounded-lg flex items-center text-sm font-medium"
										>
											{allergy}
											<button
												type="button"
												className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 focus:outline-none"
												onClick={() => {
													const updatedAllergies = formData.medical.allergies.filter((_, i) => i !== index);
													handleArrayFieldChange('allergies', updatedAllergies);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Current Medications Section - Multi-select dropdown */}
						<div>
							<label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
								💊 Current Medications
							</label>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
								Select any medications you are currently taking.
							</p>
							
							<Listbox
								value={formData.medical.currentMedications}
								onChange={(selected) => handleArrayFieldChange('currentMedications', selected)}
								multiple
							>
								{({ open }) => (
									<div className="relative mt-1">
										<Listbox.Button className="w-full rounded-xl border-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200">
											<span className={formData.medical.currentMedications.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
												{formData.medical.currentMedications.length > 0
													? formData.medical.currentMedications.length > 2
														? `${formData.medical.currentMedications[0]}, ${formData.medical.currentMedications[1]}, +${formData.medical.currentMedications.length - 2} more`
														: formData.medical.currentMedications.join(', ')
													: 'Select medications'}
											</span>
											<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
													<path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</span>
										</Listbox.Button>

										<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
											<div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-2 py-2">
												<input
													type="text"
													placeholder="Add specific medication or dosage..."
													className="w-full px-3 py-2 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
													onKeyDown={(e) => {
														if (e.key === 'Enter' && e.target.value.trim()) {
															e.preventDefault();
															const newMedication = e.target.value.trim();
															if (!formData.medical.currentMedications.includes(newMedication)) {
																handleArrayFieldChange('currentMedications', [...formData.medical.currentMedications, newMedication]);
															}
															e.target.value = '';
														}
													}}
												/>
											</div>
											<div className="pt-1">
												{medicationsOptions.map((medication) => (
													<Listbox.Option
														key={medication}
														value={medication}
														className={({ active, selected }) =>
															`cursor-pointer select-none relative py-3 px-4 ${
																active ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : 'text-gray-900 dark:text-white'
															}`
														}
													>
														{({ selected, active }) => (
															<div className="flex items-center justify-between">
																<span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
																	{medication}
																</span>
																{selected && (
																	<span className="text-purple-600 dark:text-purple-400">
																		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
																			<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																		</svg>
																	</span>
																)}
															</div>
														)}
													</Listbox.Option>
												))}
											</div>
										</Listbox.Options>
									</div>
								)}
							</Listbox>

							{formData.medical.currentMedications.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{formData.medical.currentMedications.map((medication, index) => (
										<div 
											key={index} 
											className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1.5 rounded-lg flex items-center text-sm font-medium"
										>
											{medication}
											<button
												type="button"
												className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 focus:outline-none"
												onClick={() => {
													const updatedMedications = formData.medical.currentMedications.filter((_, i) => i !== index);
													handleArrayFieldChange('currentMedications', updatedMedications);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Disabilities Section - Multi-select dropdown */}
						<div>
							<label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
								♿ Disabilities
							</label>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
								Select any disabilities or mobility challenges you have.
							</p>
							
							<Listbox
								value={formData.medical.disabilities}
								onChange={(selected) => handleArrayFieldChange('disabilities', selected)}
								multiple
							>
								{({ open }) => (
									<div className="relative mt-1">
										<Listbox.Button className="w-full rounded-xl border-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200">
											<span className={formData.medical.disabilities.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
												{formData.medical.disabilities.length > 0
													? formData.medical.disabilities.length > 2
														? `${formData.medical.disabilities[0]}, ${formData.medical.disabilities[1]}, +${formData.medical.disabilities.length - 2} more`
														: formData.medical.disabilities.join(', ')
													: 'Select disabilities'}
											</span>
											<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
													<path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</span>
										</Listbox.Button>

										<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
											<div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-2 py-2">
												<input
													type="text"
													placeholder="Search disabilities or add custom..."
													className="w-full px-3 py-2 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
													onKeyDown={(e) => {
														if (e.key === 'Enter' && e.target.value.trim()) {
															e.preventDefault();
															const newDisability = e.target.value.trim();
															if (!formData.medical.disabilities.includes(newDisability)) {
																handleArrayFieldChange('disabilities', [...formData.medical.disabilities, newDisability]);
															}
															e.target.value = '';
														}
													}}
												/>
											</div>
											<div className="pt-1">
												{disabilitiesOptions.map((disability) => (
													<Listbox.Option
														key={disability}
														value={disability}
														className={({ active, selected }) =>
															`cursor-pointer select-none relative py-3 px-4 ${
																active ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' : 'text-gray-900 dark:text-white'
															}`
														}
													>
														{({ selected, active }) => (
															<div className="flex items-center justify-between">
																<span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
																	{disability}
																</span>
																{selected && (
																	<span className="text-amber-600 dark:text-amber-400">
																		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
																			<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																		</svg>
																	</span>
																)}
															</div>
														)}
													</Listbox.Option>
												))}
											</div>
										</Listbox.Options>
									</div>
								)}
							</Listbox>

							{formData.medical.disabilities.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{formData.medical.disabilities.map((disability, index) => (
										<div 
											key={index} 
											className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-lg flex items-center text-sm font-medium"
										>
											{disability}
											<button
												type="button"
												className="ml-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 focus:outline-none"
												onClick={() => {
													const updatedDisabilities = formData.medical.disabilities.filter((_, i) => i !== index);
													handleArrayFieldChange('disabilities', updatedDisabilities);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
												</svg>
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Vision Section */}
						<div>
							<label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
								👁️ Vision Details
							</label>
							<div className="flex items-center mb-4">
								<input
									id="wearsGlasses"
									type="checkbox"
									checked={formData.medical.vision.wearsGlasses}
									onChange={(e) => {
										setFormData(prev => ({
											...prev,
											medical: {
												...prev.medical,
												vision: {
													...prev.medical.vision,
													wearsGlasses: e.target.checked
												}
											}
										}));
									}}
									className="w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>
								<label htmlFor="wearsGlasses" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
									I wear glasses or contact lenses
								</label>
							</div>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
								<div>
									<label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
										Left Eye Vision
									</label>
									<input
										type="text"
										name="leftEye"
										value={formData.medical.vision.leftEye}
										onChange={(e) => {
											setFormData(prev => ({
												...prev,
												medical: {
													...prev.medical,
													vision: {
														...prev.medical.vision,
														leftEye: e.target.value
													}
												}
											}));
										}}
										placeholder="-0.5"
										className={inputClassName()}
										disabled={!formData.medical.vision.wearsGlasses}
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
										Right Eye Vision
									</label>
									<input
										type="text"
										name="rightEye"
										value={formData.medical.vision.rightEye}
										onChange={(e) => {
											setFormData(prev => ({
												...prev,
												medical: {
													...prev.medical,
													vision: {
														...prev.medical.vision,
														rightEye: e.target.value
													}
												}
											}));
										}}
										placeholder="-0.75"
										className={inputClassName()}
										disabled={!formData.medical.vision.wearsGlasses}
									/>
								</div>
							</div>
						</div>

						{/* Hearing Aids Section */}
						<div>
							<label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
								👂 Hearing
							</label>
							<div className="flex items-center">
								<input
									id="hearingAids"
									type="checkbox"
									checked={formData.medical.hearingAids}
									onChange={(e) => {
										setFormData(prev => ({
											...prev,
											medical: {
												...prev.medical,
												hearingAids: e.target.checked
											}
										}));
									}}
									className="w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>
								<label htmlFor="hearingAids" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
									I use hearing aids
								</label>
							</div>
						</div>

						{errors.submit && (
							<div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
								<p className="text-sm text-red-600 dark:text-red-400 flex items-center">
									<span className="mr-2">❌</span> {errors.submit}
								</p>
							</div>
						)}

						<div className="flex justify-between pt-6">
							<button
								type="button"
								onClick={() => setCurrentStep(prev => prev - 1)}
								className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
							>
								← Back
							</button>
							<button
								type="button"
								onClick={handleNext}
								disabled={loading}
								className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
							>
								{loading ? (
									<span className="flex items-center">
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Saving...
									</span>
								) : (
									'Next Step →'
								)}
							</button>
						</div>
					</div>
				);

				default:
					// Remove review page, redirect handled in handleNext
					return null;
		}
	};

	return (
		<div className="min-h-screen h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Enhanced Progress Steps */}
				<div className="mb-12">
					<div className="flex items-center justify-between">
						{steps.map((step, stepIdx) => (
							<div key={step.id} className="flex items-center flex-1">
								<div className="flex flex-col items-center">
									<div
										className={`${
											currentStep >= step.id
												? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
												: 'bg-white dark:bg-gray-800 text-gray-400 shadow-md'
										} rounded-full border-4 ${
											currentStep >= step.id ? 'border-blue-200' : 'border-gray-200 dark:border-gray-700'
										} flex items-center justify-center h-16 w-16 font-bold text-lg transition-all duration-300`}
									>
										{currentStep > step.id ? (
											<span className="text-2xl">✓</span>
										) : (
											<span>{step.id}</span>
										)}
									</div>
									<div className="mt-4 text-center">
										<h3 className={`text-sm font-bold ${
											currentStep >= step.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
										}`}>
											{step.name}
										</h3>
										<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
											{step.description}
										</p>
									</div>
								</div>
								{stepIdx !== steps.length - 1 && (
									<div className={`flex-1 h-1 mx-4 rounded-full ${
										currentStep > step.id ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
									} transition-all duration-300`} />
								)}
							</div>
						))}
					</div>
				</div>

				{/* Enhanced Form Card */}
				<div className="bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-3xl p-8 md:p-12">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							{steps[currentStep - 1].name}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							{steps[currentStep - 1].description}
						</p>
					</div>
					{renderStepContent()}
				</div>
			</div>
		</div>
	);
}

export default Onboarding;