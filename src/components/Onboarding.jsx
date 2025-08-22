import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Listbox } from '@headlessui/react';
import { addUserProfile } from '../utils/firestoreService';

// Progress steps
const steps = [
	{ id: 1, name: 'Basic Information', description: 'Personal and contact details' },
	{ id: 2, name: 'Medical Context', description: 'Your medical history and conditions' },
	{ id: 3, name: 'Lifestyle', description: 'Your habits and preferences' },
];

// Option sets
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
	'Regular Exercise', 'Smoking', 'Drinking Alcohol', 'Meditation', 'Yoga', 'Running/Jogging', 'Swimming', 'Cycling', 'Weight Training', 'Walking', 'Late Night Sleep', 'Early Morning Routine', 'Screen Time (High)', 'Reading', 'Gaming'
];

const preferenceOptions = [
	'Vegetarian','Vegan','Non-Vegetarian','Gluten-Free','Low Sugar','No Dairy','Organic Food','Home Cooked Meals','Fast Food','Spicy Food','Low Sodium','High Protein Diet'
];

const chronicConditionsOptions = [
	'High Blood Pressure','Diabetes Type 1','Diabetes Type 2','Asthma','Heart Disease','Cancer','Stroke','Arthritis','Depression','Anxiety','COPD','Kidney Disease','Liver Disease','Thyroid Disorder','Migraine','Epilepsy','Fibromyalgia','Chronic Fatigue Syndrome','Osteoporosis','Bipolar Disorder','Schizophrenia','Multiple Sclerosis','Parkinson\'s Disease','Alzheimer\'s Disease','IBS','Crohn\'s Disease','Ulcerative Colitis','Celiac Disease'
];

const allergiesOptions = [
	'Penicillin','Sulfa Drugs','NSAIDs','Aspirin','Latex','Peanuts','Tree Nuts','Milk','Eggs','Wheat','Soy','Fish','Shellfish','Pollen','Dust Mites','Pet Dander','Mold','Bee Stings','Contrast Dye'
];

const medicationsOptions = [
	'Lisinopril','Atorvastatin','Levothyroxine','Metformin','Amlodipine','Metoprolol','Omeprazole','Simvastatin','Losartan','Albuterol','Gabapentin','Hydrochlorothiazide','Sertraline','Acetaminophen','Ibuprofen','Fluoxetine','Amoxicillin','Prednisone','Escitalopram','Tramadol','Furosemide','Antihypertensives','Antidiabetics','Statins','Anticoagulants','Beta Blockers','Antidepressants','Antibiotics','Pain Relievers','Anti-inflammatories','Antihistamines','Inhalers','Thyroid Medications','Vitamins & Supplements'
];

// Shared UI helpers
const inputClassName = (error) => `
	mt-2 block w-full rounded-xl glass border soft-divider px-4 py-3 text-sm font-medium text-text placeholder-secondary
	focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200
	${error ? 'border-red-500/60 bg-red-50/50 dark:bg-red-900/20 focus:ring-red-400/30' : ''}
`.trim();

const selectableItemClassName = (isSelected) => `
	px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium text-center
	${isSelected ? 'glass-cta text-white shadow-lg scale-[1.02]' : 'glass border soft-divider text-text hover-glow-primary'}
`.trim();

const selectClassName = (error) => `
	mt-1 block w-full rounded-xl glass border soft-divider sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all
	${error ? 'border-red-500/60 bg-red-50/50 dark:bg-red-900/20' : ''}
`.trim();

function Onboarding() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		basic: {
			fullName: '', dob: '', gender: '', bloodGroup: '',
			height: { value: '', unit: 'cm' }, weight: { value: '', unit: 'kg' },
			contactNumber: '', emergencyContact: { name: '', number: '', relation: '' }
		},
		medical: {
			chronicConditions: [], allergies: [], currentMedications: [],
			vision: { leftEye: '', rightEye: '', wearsGlasses: false }, hearingAids: false
		},
		lifestyle: { habits: [], preferences: [] },
		onboardingCompleted: false,
	});

	useEffect(() => {
		if (user && user.onboarding === true) navigate('/user');
	}, [user, navigate]);

	// Handlers
	const handleBasicInfoChange = (e) => {
		const { name, value } = e.target;
		if (name.includes('.')) {
			const [parent, child] = name.split('.');
			setFormData((prev) => ({ ...prev, basic: { ...prev.basic, [parent]: { ...prev.basic[parent], [child]: value } } }));
		} else {
			setFormData((prev) => ({ ...prev, basic: { ...prev.basic, [name]: value } }));
		}
	};

	const handleArrayFieldChange = (section, field, value) => {
		setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
	};

	const handleLifestyleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, lifestyle: { ...prev.lifestyle, [field]: value } }));
	};

	// Validation
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
	const validateMedicalInfo = () => { setErrors({}); return true; };
	const validateLifestyleInfo = () => { setErrors({}); return true; };

	// Next step + save
	const handleNext = async () => {
		if (currentStep === 1 && !validateBasicInfo()) return;
		if (currentStep === 2 && !validateMedicalInfo()) return;
		if (currentStep === 3 && !validateLifestyleInfo()) return;

		try {
			setLoading(true);
			const payload =
				currentStep === 1 ? { basic: formData.basic, onboardingCompleted: true } :
				currentStep === 2 ? { medical: formData.medical } :
				currentStep === 3 ? { lifestyle: formData.lifestyle } : {};

			if (user?.uid && Object.keys(payload).length > 0) {
				const res = await addUserProfile(user.uid, payload);
				if (!res.success) throw new Error(res.error || 'Failed to save profile');
			}

			if (currentStep === 3) { navigate('/user'); return; }
			setCurrentStep((prev) => prev + 1);
		} catch (error) {
			console.error('Error saving data:', error);
			setErrors({ submit: error.message });
		} finally {
			setLoading(false);
		}
	};

	// Step renderers
	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-8">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="sm:col-span-2">
								<label className="block text-sm font-semibold text-text mb-1">Full Name *</label>
								<input type="text" name="fullName" value={formData.basic.fullName} onChange={handleBasicInfoChange} placeholder="Enter your full name" className={inputClassName(errors.fullName)} />
								{errors.fullName && <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>}
							</div>

							<div>
								<label className="block text-sm font-semibold text-text mb-1">Date of Birth *</label>
								<input type="date" name="dob" value={formData.basic.dob} onChange={handleBasicInfoChange} className={inputClassName(errors.dob)} />
								{errors.dob && <p className="mt-2 text-sm text-red-500">{errors.dob}</p>}
							</div>

							<div>
								<label className="block text-sm font-semibold text-text mb-1">Gender *</label>
								<Listbox value={formData.basic.gender} onChange={(val) => handleBasicInfoChange({ target: { name: 'gender', value: val } })}>
									<div className="relative">
										<Listbox.Button className={selectClassName(errors.gender)}>
											<span className={formData.basic.gender ? 'text-text' : 'text-secondary'}>
												{genderOptions.find((opt) => opt.value === formData.basic.gender)?.label || 'Select Gender'}
											</span>
										</Listbox.Button>
										<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl glass-elevated border soft-divider shadow-xl">
											{genderOptions.slice(1).map((option) => (
												<Listbox.Option key={option.value} value={option.value} className={({ active, selected }) => `cursor-pointer select-none px-4 py-3 text-sm ${active ? 'bg-white/10' : ''} ${selected ? 'text-primary font-semibold' : 'text-text'}`}>
													{option.label}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</div>
								</Listbox>
								{errors.gender && <p className="mt-2 text-sm text-red-500">{errors.gender}</p>}
							</div>

							<div>
								<label className="block text-sm font-semibold text-text mb-1">Blood Group *</label>
								<Listbox value={formData.basic.bloodGroup} onChange={(val) => handleBasicInfoChange({ target: { name: 'bloodGroup', value: val } })}>
									<div className="relative">
										<Listbox.Button className={selectClassName(errors.bloodGroup)}>
											<span className={formData.basic.bloodGroup ? 'text-text' : 'text-secondary'}>
												{bloodGroupOptions.find((opt) => opt.value === formData.basic.bloodGroup)?.label || 'Select Blood Group'}
											</span>
										</Listbox.Button>
										<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl glass-elevated border soft-divider shadow-xl">
											{bloodGroupOptions.slice(1).map((option) => (
												<Listbox.Option key={option.value} value={option.value} className={({ active, selected }) => `cursor-pointer select-none px-4 py-3 text-sm ${active ? 'bg-white/10' : ''} ${selected ? 'text-primary font-semibold' : 'text-text'}`}>
													{option.label}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</div>
								</Listbox>
								{errors.bloodGroup && <p className="mt-2 text-sm text-red-500">{errors.bloodGroup}</p>}
							</div>

							<div>
								<label className="block text-sm font-semibold text-text mb-1">Height *</label>
								<div className="flex gap-2">
									<input type="number" name="height.value" value={formData.basic.height.value} onChange={handleBasicInfoChange} placeholder="165" className={`${inputClassName(errors.height)} flex-1`} />
									<select name="height.unit" value={formData.basic.height.unit} onChange={handleBasicInfoChange} className="rounded-xl glass border soft-divider px-4 py-3 text-sm font-medium w-20">
										<option value="cm">cm</option>
										<option value="ft">ft</option>
									</select>
								</div>
								{errors.height && <p className="mt-2 text-sm text-red-500">{errors.height}</p>}
							</div>

							<div>
								<label className="block text-sm font-semibold text-text mb-1">Weight *</label>
								<div className="flex gap-2">
									<input type="number" name="weight.value" value={formData.basic.weight.value} onChange={handleBasicInfoChange} placeholder="70" className={`${inputClassName(errors.weight)} flex-1`} />
									<select name="weight.unit" value={formData.basic.weight.unit} onChange={handleBasicInfoChange} className="rounded-xl glass border soft-divider px-4 py-3 text-sm font-medium w-20">
										<option value="kg">kg</option>
										<option value="lbs">lbs</option>
									</select>
								</div>
								{errors.weight && <p className="mt-2 text-sm text-red-500">{errors.weight}</p>}
							</div>
						</div>

						{errors.submit && (
							<div className="glass rounded-xl p-4 border border-red-500/40">
								<p className="text-sm text-red-500">{errors.submit}</p>
							</div>
						)}

						<div className="flex justify-end pt-4">
							<button type="button" onClick={handleNext} disabled={loading} className="glass-cta px-6 py-3 rounded-xl disabled:opacity-50">
								{loading ? 'Saving...' : 'Next Step →'}
							</button>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-8">
						{/* Chronic Conditions */}
						<div>
							<label className="block text-lg font-bold text-text mb-3">🩺 Chronic Conditions</label>
							<Listbox value={formData.medical.chronicConditions} onChange={(selected) => handleArrayFieldChange('medical','chronicConditions', selected)} multiple>
								<div className="relative">
									<Listbox.Button className={selectClassName(false)}>
										<span className={formData.medical.chronicConditions.length ? 'text-text' : 'text-secondary'}>
											{formData.medical.chronicConditions.length ? formData.medical.chronicConditions.join(', ') : 'Select chronic conditions'}
										</span>
									</Listbox.Button>
									<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl glass-elevated border soft-divider shadow-xl">
										{chronicConditionsOptions.map((item) => (
											<Listbox.Option key={item} value={item} className={({ active, selected }) => `cursor-pointer select-none px-4 py-3 text-sm ${active ? 'bg-white/10' : ''} ${selected ? 'text-primary font-semibold' : 'text-text'}`}>
												{item}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</div>
							</Listbox>
							{formData.medical.chronicConditions.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{formData.medical.chronicConditions.map((cond, idx) => (
										<span key={idx} className="px-3 py-1.5 rounded-lg text-xs glass border soft-divider">{cond}</span>
									))}
								</div>
							)}
						</div>

						{/* Allergies */}
						<div>
							<label className="block text-lg font-bold text-text mb-3">⚠️ Allergies</label>
							<Listbox value={formData.medical.allergies} onChange={(selected) => handleArrayFieldChange('medical','allergies', selected)} multiple>
								<div className="relative">
									<Listbox.Button className={selectClassName(false)}>
										<span className={formData.medical.allergies.length ? 'text-text' : 'text-secondary'}>
											{formData.medical.allergies.length ? formData.medical.allergies.join(', ') : 'Select allergies'}
										</span>
									</Listbox.Button>
									<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl glass-elevated border soft-divider shadow-xl">
										{allergiesOptions.map((item) => (
											<Listbox.Option key={item} value={item} className={({ active, selected }) => `cursor-pointer select-none px-4 py-3 text-sm ${active ? 'bg-white/10' : ''} ${selected ? 'text-primary font-semibold' : 'text-text'}`}>
												{item}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</div>
							</Listbox>
							{formData.medical.allergies.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{formData.medical.allergies.map((alg, idx) => (
										<span key={idx} className="px-3 py-1.5 rounded-lg text-xs glass border soft-divider">{alg}</span>
									))}
								</div>
							)}
						</div>

						{/* Medications */}
						<div>
							<label className="block text-lg font-bold text-text mb-3">💊 Current Medications</label>
							<Listbox value={formData.medical.currentMedications} onChange={(selected) => handleArrayFieldChange('medical','currentMedications', selected)} multiple>
								<div className="relative">
									<Listbox.Button className={selectClassName(false)}>
										<span className={formData.medical.currentMedications.length ? 'text-text' : 'text-secondary'}>
											{formData.medical.currentMedications.length ? formData.medical.currentMedications.join(', ') : 'Select medications'}
										</span>
									</Listbox.Button>
									<Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl glass-elevated border soft-divider shadow-xl">
										{medicationsOptions.map((item) => (
											<Listbox.Option key={item} value={item} className={({ active, selected }) => `cursor-pointer select-none px-4 py-3 text-sm ${active ? 'bg-white/10' : ''} ${selected ? 'text-primary font-semibold' : 'text-text'}`}>
												{item}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</div>
							</Listbox>
							{formData.medical.currentMedications.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{formData.medical.currentMedications.map((med, idx) => (
										<span key={idx} className="px-3 py-1.5 rounded-lg text-xs glass border soft-divider">{med}</span>
									))}
								</div>
							)}
						</div>

						{errors.submit && <div className="glass rounded-xl p-4 border border-red-500/40 text-sm text-red-500">{errors.submit}</div>}

						<div className="flex justify-between pt-4">
							<button type="button" onClick={() => setCurrentStep((s) => s - 1)} className="glass rounded-xl px-5 py-3 text-text border soft-divider">← Back</button>
							<button type="button" onClick={handleNext} disabled={loading} className="glass-cta px-6 py-3 rounded-xl disabled:opacity-50">{loading ? 'Saving...' : 'Next Step →'}</button>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-8">
						<div>
							<label className="block text-lg font-bold text-text mb-3">🏃‍♂️ Your Habits</label>
							<p className="text-sm text-secondary mb-4">Select all that apply</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
								{habitOptions.map((habit) => {
									const selected = formData.lifestyle.habits.includes(habit);
									return (
										<button key={habit} type="button" onClick={() => {
											const cur = formData.lifestyle.habits;
											handleLifestyleChange('habits', selected ? cur.filter((h) => h !== habit) : [...cur, habit]);
										}} className={selectableItemClassName(selected)}>
											{habit}
										</button>
									);
								})}
							</div>
						</div>

						<div>
							<label className="block text-lg font-bold text-text mb-3">🍽️ Dietary Preferences</label>
							<p className="text-sm text-secondary mb-4">Select your dietary preferences and restrictions</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
								{preferenceOptions.map((pref) => {
									const selected = formData.lifestyle.preferences.includes(pref);
									return (
										<button key={pref} type="button" onClick={() => {
											const cur = formData.lifestyle.preferences;
											handleLifestyleChange('preferences', selected ? cur.filter((p) => p !== pref) : [...cur, pref]);
										}} className={selectableItemClassName(selected)}>
											{pref}
										</button>
									);
								})}
							</div>
						</div>

						{errors.submit && <div className="glass rounded-xl p-4 border border-red-500/40 text-sm text-red-500">{errors.submit}</div>}

						<div className="flex justify-between pt-4">
							<button type="button" onClick={() => setCurrentStep((s) => s - 1)} className="glass rounded-xl px-5 py-3 text-text border soft-divider">← Back</button>
							<button type="button" onClick={handleNext} disabled={loading} className="glass-cta px-6 py-3 rounded-xl disabled:opacity-50">{loading ? 'Saving...' : 'Finish →'}</button>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background aurora-bg px-3 sm:px-6 py-6 sm:py-8">
			<div className="max-w-5xl mx-auto">
				{/* Progress Steps */}
				<div className="mb-8 sm:mb-10">
					<div className="glass rounded-2xl p-4 sm:p-6 border soft-divider">
						<div className="flex items-center justify-between gap-2">
							{steps.map((step, stepIdx) => (
								<div key={step.id} className="flex items-center flex-1 min-w-0">
									<div className="flex flex-col items-center w-full">
										<div className={`rounded-full h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center font-bold text-base sm:text-lg shadow-lg ${currentStep >= step.id ? 'bg-gradient-to-r from-primary to-accent text-white' : 'glass border soft-divider text-secondary'}`}>
											{currentStep > step.id ? <span className="text-xl">✓</span> : <span>{step.id}</span>}
										</div>
										<div className="mt-2 text-center min-w-0">
											<h3 className={`text-[11px] sm:text-sm font-bold truncate ${currentStep >= step.id ? 'text-text' : 'text-secondary'}`}>{step.name}</h3>
											<p className="hidden sm:block text-xs text-secondary mt-1">{step.description}</p>
										</div>
									</div>
									{stepIdx !== steps.length - 1 && (
										<div className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full ${currentStep > step.id ? 'bg-primary/60' : 'bg-white/20 dark:bg-black/20'}`} />
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Form Card */}
				<div className="glass-elevated rounded-3xl p-5 sm:p-8 border soft-divider">
					<div className="mb-6 sm:mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">{steps[currentStep - 1].name}</h1>
						<p className="text-secondary">{steps[currentStep - 1].description}</p>
					</div>
					{renderStepContent()}
				</div>
			</div>
		</div>
	);
}

export default Onboarding;