import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { loadSavedMessages, saveMessages } from '../utils/storage';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (status.error) {
      setStatus((prev) => ({ ...prev, error: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setStatus({ submitting: false, success: false, error: 'Please enter a valid full name.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus({ submitting: false, success: false, error: 'Please enter a valid email address.' });
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setStatus({ submitting: false, success: false, error: 'Please enter a valid phone number.' });
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setStatus({ submitting: false, success: false, error: 'Message must be at least 10 characters long.' });
      return;
    }

    setStatus({ submitting: true, success: false, error: '' });

    // Save safely to localStorage with Array.isArray() validation
    const existing = loadSavedMessages();
    const newMessage = {
      id: `MSG-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      ...formData,
    };
    saveMessages([newMessage, ...existing]);

    // Simulate fast reliable network feedback
    setTimeout(() => {
      setStatus({ submitting: false, success: true, error: '' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    }, 400);
  };

  return (
    <section className="bg-gray-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-red-500 font-semibold uppercase tracking-wider text-sm">
            CONTACT US
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
            GET IN <span className="text-red-500">TOUCH</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Have any questions or special rental requirements? Our team is available 24/7 to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Contact Information Cards */}
          <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Office Location
                  </h4>
                  <p className="text-white mt-1 text-base">
                    Commercial Fleet Center, Bahawalpur, Punjab, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <FaPhoneAlt size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Phone & WhatsApp
                  </h4>
                  <a
                    href="tel:+18005550199"
                    className="text-white hover:text-red-400 transition mt-1 block text-base font-medium"
                  >
                    +1 (800) 555-0199 / +92 300 1234567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <FaEnvelope size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Email Inquiries
                  </h4>
                  <a
                    href="mailto:support@carrent.com"
                    className="text-white hover:text-red-400 transition mt-1 block text-base font-medium"
                  >
                    support@carrent.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <FaClock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Working Hours
                  </h4>
                  <p className="text-white mt-1 text-base">
                    Monday – Sunday: 24/7 Non-stop Service
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">
              Send Us a Message
            </h3>

            {status.success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  <FaCheckCircle />
                </div>
                <h4 className="text-2xl font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-gray-300 mt-2 text-sm sm:text-base max-w-md mx-auto">
                  Thank you for reaching out. Your inquiry has been recorded and our team will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus({ submitting: false, success: false, error: '' })}
                  className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {status.error && (
                  <div className="mb-5 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-sm">
                    {status.error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Fahad Khan"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. +92 300 1234567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Tell us what vehicle you're interested in, pickup location, or any questions..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.submitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-lg mt-6 transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  {status.submitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
