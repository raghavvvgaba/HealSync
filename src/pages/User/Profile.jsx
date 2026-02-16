import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaHeart, FaRunning, FaUtensils, FaEdit, FaArrowLeft, FaTransgender } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdBloodtype, MdSick, MdPhone, MdCalendarToday, MdAccessibility } from 'react-icons/md';
import { BsCapsulePill, BsEyeFill, BsEarFill } from 'react-icons/bs';
import { AiOutlineWarning } from 'react-icons/ai';
import { getUserProfile } from '../../utils/firestoreService';
import { useAuth } from '../../context/authContext';

export function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.uid) return;
      try {
        const result = await getUserProfile(user.uid);
        if (result.success) setProfileData(result.data); else setError(result.error || 'Failed to load profile');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally { setLoading(false); }
    };
    fetchProfileData();
  }, [user]);

  // Skeleton (unchanged) -----------------------------------------------------
  if (loading) {
    return (
  <div className="min-h-screen bg-background aurora-bg aurora-subtle px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-8">
          <div className="h-10 w-56 glass rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-52 glass rounded-2xl border soft-divider" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
  <div className="min-h-screen bg-background aurora-bg aurora-subtle flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-10 border soft-divider max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-text">Profile Error</h2>
          <p className="text-secondary text-sm">{error}</p>
          <Link to="/user" className="glass-cta px-6 py-3 rounded-xl font-semibold inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
  <div className="min-h-screen bg-background aurora-bg aurora-subtle flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-10 border soft-divider max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-text">Profile Not Found</h2>
          <p className="text-secondary text-sm">We couldn't find your profile data.</p>
          <Link to="/user" className="glass-cta px-6 py-3 rounded-xl font-semibold inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const { basic = {}, medical = {}, lifestyle = {} } = profileData;

  // Reusable components (premium styling) -----------------------------------
  const Card = ({ title, icon: Icon, children, className = '' }) => (
    <div className={`glass-elevated rounded-2xl p-6 border soft-divider hover-glow-primary transition-all duration-300 group ${className}`}>
      <div className="flex items-center gap-4 mb-5 pb-3 border-b soft-divider">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
          <Icon className="text-lg" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-text tracking-tight">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface/30 border soft-divider group transition-colors hover:bg-surface/50">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center group-hover:text-primary transition-colors shadow-sm">
          {Icon ? <Icon className="text-xs shrink-0" /> : <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />}
        </div>
        <span className="text-xs sm:text-sm font-semibold text-secondary truncate">{label}</span>
      </div>
      <span className="text-xs sm:text-sm text-text font-bold max-w-[55%] text-right truncate">
        {value || <span className="text-secondary/50 font-normal italic">Not specified</span>}
      </span>
    </div>
  );

  const TagList = ({ items, colorClass = "text-primary bg-primary/5 border-primary/10" }) => (
    <div className="flex flex-wrap gap-2">
      {items && items.length > 0 ? (
        items.map((item, i) => (
          <span key={i} className={`px-3 py-1.5 rounded-xl text-xs font-bold border soft-divider glass transition-all hover:scale-105 cursor-default ${colorClass}`}>
            {item}
          </span>
        ))
      ) : (
        <div className="w-full p-4 rounded-xl border border-dashed soft-divider bg-surface/20 flex items-center justify-center">
          <span className="text-xs text-secondary/60 italic font-medium">None specified</span>
        </div>
      )}
    </div>
  );

  const yesNoPill = (val) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${val ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-white/5 text-secondary border soft-divider'}`}>{val ? 'Yes' : 'No'}</span>
  );

  // Layout -------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background aurora-bg aurora-faint px-3 sm:px-6 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header - Back Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/user" className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-secondary hover-glow-primary transition-all font-bold">
            <FaArrowLeft />
            <span>Dashboard</span>
          </Link>
          <Link to="../edit-profile" className="glass-cta flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-transform">
            <FaEdit /> Edit Profile
          </Link>
        </div>

        {/* Patient Header Card */}
        <div className="glass-elevated rounded-3xl p-6 sm:p-8 border soft-divider relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glass-cta text-white flex items-center justify-center shadow-2xl shrink-0 transform group-hover:rotate-6 transition-transform duration-700">
              <FaUserCircle className="text-3xl sm:text-4xl" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight truncate">
                  {basic.fullName || user?.displayName || 'My Profile'}
                </h1>
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                  Patient Profile
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-secondary font-bold">
                <div className="flex items-center gap-2 group/info cursor-default">
                  <div className="w-8 h-8 rounded-full bg-surface/50 flex items-center justify-center group-hover/info:bg-primary/10 group-hover/info:text-primary transition-all shadow-inner">
                    <MdPhone className="text-xs" />
                  </div>
                  <span className="text-xs sm:text-sm">{basic.contactNumber || 'Contact not set'}</span>
                </div>
                <div className="flex items-center gap-2 group/info cursor-default">
                  <div className="w-8 h-8 rounded-full bg-surface/50 flex items-center justify-center group-hover/info:bg-primary/10 group-hover/info:text-primary transition-all shadow-inner">
                    <MdCalendarToday className="text-xs" />
                  </div>
                  <span className="text-xs sm:text-sm">{basic.dob ? `${new Date().getFullYear() - new Date(basic.dob).getFullYear()} years` : 'Age: N/A'}</span>
                </div>
                <div className="flex items-center gap-2 group/info cursor-default">
                  <div className="w-8 h-8 rounded-full bg-surface/50 flex items-center justify-center group-hover/info:bg-primary/10 group-hover/info:text-primary transition-all shadow-inner">
                    <MdBloodtype className="text-xs" />
                  </div>
                  <span className="text-xs sm:text-sm">Blood: {basic.bloodGroup || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Identification" icon={FaUserCircle}>
            <Field label="Gender" value={basic.gender} icon={FaTransgender} />
            <Field label="Date of Birth" value={basic.dob ? new Date(basic.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null} icon={MdCalendarToday} />
            <Field label="User ID" value={user?.uid?.substring(0, 8).toUpperCase()} icon={FaUserCircle} />
          </Card>

          <Card title="Physical Stats" icon={GiBodyHeight}>
            <Field label="Height" value={basic?.height ? `${basic.height.value} ${basic.height.unit}` : null} icon={GiBodyHeight} />
            <Field label="Weight" value={basic?.weight ? `${basic.weight.value} ${basic.weight.unit}` : null} icon={MdSick} />
            <Field label="BMI" value={basic?.weight?.value && basic?.height?.value ? (basic.weight.value / Math.pow(basic.height.value/100, 2)).toFixed(1) : null} />
          </Card>

          <Card title="Emergency Contact" icon={MdPhone}>
            <Field label="Full Name" value={basic?.emergencyContact?.name} icon={FaUserCircle} />
            <Field label="Phone Number" value={basic?.emergencyContact?.number} icon={MdPhone} />
            <Field label="Relationship" value={basic?.emergencyContact?.relation} />
          </Card>

          <Card title="Medical History" icon={FaHeart}>
            <TagList items={medical?.chronicConditions} colorClass="text-red-500 bg-red-500/5 border-red-500/10" />
          </Card>

          <Card title="Allergies" icon={AiOutlineWarning}>
            <TagList items={medical?.allergies} colorClass="text-orange-500 bg-orange-500/5 border-orange-500/10" />
          </Card>

          <Card title="Current Meds" icon={BsCapsulePill}>
            <TagList items={medical?.currentMedications} colorClass="text-purple-500 bg-purple-500/5 border-purple-500/10" />
          </Card>

          <Card title="Sensory & Mobility" icon={MdAccessibility}>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface/30 border soft-divider">
                <span className="text-xs font-bold text-secondary uppercase flex items-center gap-2"><BsEyeFill className="text-primary" /> Wears Glasses</span>
                {yesNoPill(medical?.vision?.wearsGlasses)}
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface/30 border soft-divider">
                <span className="text-xs font-bold text-secondary uppercase flex items-center gap-2"><BsEarFill className="text-primary" /> Hearing Aids</span>
                {yesNoPill(medical?.hearingAids)}
              </div>
              <TagList items={medical?.disabilities} colorClass="text-blue-500 bg-blue-500/5 border-blue-500/10" />
            </div>
          </Card>

          <Card title="Lifestyle" icon={FaRunning}>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-secondary tracking-widest mb-2 block">HABITS</span>
                <TagList items={lifestyle?.habits} colorClass="text-emerald-500 bg-emerald-500/5 border-emerald-500/10" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-secondary tracking-widest mb-2 block">DIETARY</span>
                <TagList items={lifestyle?.preferences} colorClass="text-amber-500 bg-amber-500/5 border-amber-500/10" />
              </div>
            </div>
          </Card>
        </div>

        <div className="pt-10 pb-6 border-t soft-divider text-center">
          <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] animate-pulse">
            Your secure digital health record
          </p>
        </div>
      </div>
    </div>
  );
}
