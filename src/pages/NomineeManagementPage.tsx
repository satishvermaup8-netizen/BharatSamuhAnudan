import { useState, useEffect } from 'react';
import { Heart, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { getNominees, createNominee, updateNominee, deleteNominee } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export function NomineeManagementPage() {
  const { user } = useAuth();
  const [nominees, setNominees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    aadhaar_number: '',
    mobile: '',
    email: '',
    address: '',
    date_of_birth: '',
  });

  useEffect(() => {
    if (user) {
      loadNominees();
    }
  }, [user]);

  const loadNominees = async () => {
    setLoading(true);
    try {
      const data = await getNominees(user!.id);
      setNominees(data);
    } catch (error) {
      console.error('Failed to load nominees:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.relationship) {
      alert('कृपया नाम और संबंध दर्ज करें');
      return;
    }

    setLoading(true);
    try {
      await createNominee({ ...formData, user_id: user!.id });
      alert('नामांकित सफलतापूर्वक जोड़ा गया');
      setShowAddForm(false);
      resetForm();
      await loadNominees();
    } catch (error: any) {
      alert(`नामांकित जोड़ने में विफल: ${error.message}`);
    }
    setLoading(false);
  };

  const handleEdit = (nominee: any) => {
    setEditingId(nominee.id);
    setFormData({
      name: nominee.name,
      relationship: nominee.relationship,
      aadhaar_number: nominee.aadhaar_number || '',
      mobile: nominee.mobile || '',
      email: nominee.email || '',
      address: nominee.address || '',
      date_of_birth: nominee.date_of_birth || '',
    });
  };

  const handleUpdate = async (nomineeId: string) => {
    if (!formData.name || !formData.relationship) {
      alert('कृपया नाम और संबंध दर्ज करें');
      return;
    }

    setLoading(true);
    try {
      await updateNominee(nomineeId, formData);
      alert('नामांकित सफलतापूर्वक अपडेट किया गया');
      setEditingId(null);
      resetForm();
      await loadNominees();
    } catch (error: any) {
      alert(`अपडेट करने में विफल: ${error.message}`);
    }
    setLoading(false);
  };

  const handleDelete = async (nomineeId: string) => {
    if (!confirm('क्या आप इस नामांकित को हटाना चाहते हैं?')) return;

    setLoading(true);
    try {
      await deleteNominee(nomineeId);
      alert('नामांकित सफलतापूर्वक हटाया गया');
      await loadNominees();
    } catch (error: any) {
      alert(`हटाने में विफल: ${error.message}`);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      aadhaar_number: '',
      mobile: '',
      email: '',
      address: '',
      date_of_birth: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
              <Heart className="w-10 h-10 text-red-600" />
              <span>नामांकित प्रबंधन</span>
            </h1>
            <p className="text-gray-600">अपने नामांकित व्यक्तियों को जोड़ें और प्रबंधित करें</p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>नामांकित जोड़ें</span>
          </button>
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">नया नामांकित जोड़ें</h2>
              </div>

              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      नाम <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      संबंध <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                      required
                    >
                      <option value="">चुनें...</option>
                      <option value="spouse">पति/पत्नी</option>
                      <option value="son">बेटा</option>
                      <option value="daughter">बेटी</option>
                      <option value="father">पिता</option>
                      <option value="mother">माता</option>
                      <option value="brother">भाई</option>
                      <option value="sister">बहन</option>
                      <option value="other">अन्य</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">आधार नंबर</label>
                    <input
                      type="text"
                      name="aadhaar_number"
                      value={formData.aadhaar_number}
                      onChange={handleInputChange}
                      maxLength={12}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">मोबाइल</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ईमेल</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">जन्म तिथि</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">पता</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" disabled={loading} className="flex-1 btn-primary">
                    सहेजें
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="flex-1 btn-secondary"
                  >
                    रद्द करें
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Nominees List */}
        {loading && nominees.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-trust border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">लोड हो रहा है...</p>
          </div>
        ) : nominees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">कोई नामांकित नहीं</p>
            <p className="text-gray-400 mb-6">अपना पहला नामांकित जोड़ने के लिए ऊपर क्लिक करें</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nominees.map((nominee) => (
              <div key={nominee.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6">
                  {editingId === nominee.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(nominee.id); }} className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="नाम"
                        required
                      />
                      <input
                        type="text"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="संबंध"
                        required
                      />
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="मोबाइल"
                      />
                      <div className="flex space-x-2">
                        <button type="submit" className="flex-1 btn-primary flex items-center justify-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>सहेजें</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); resetForm(); }}
                          className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>रद्द</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{nominee.name}</h3>
                            <p className="text-sm text-gray-600">{nominee.relationship}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {nominee.mobile && <p>📱 {nominee.mobile}</p>}
                        {nominee.email && <p>✉️ {nominee.email}</p>}
                        {nominee.aadhaar_number && <p>🆔 {nominee.aadhaar_number}</p>}
                        {nominee.address && <p>📍 {nominee.address}</p>}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(nominee)}
                          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>संपादित करें</span>
                        </button>
                        <button
                          onClick={() => handleDelete(nominee.id)}
                          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>हटाएं</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
