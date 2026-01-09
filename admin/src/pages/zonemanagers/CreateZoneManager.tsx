import styles from "./CreateZoneManager.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import api from "../../services/api";
import { useToast } from "../../shared/toast/ToastContext";

const CreateZoneManager = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  
  // regions
  const [regions, setRegions] = useState<any[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<any[]>([]);
  const [regionSearch, setRegionSearch] = useState("");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  // loading
  const [loading, setLoading] = useState(false);

  // ================= FETCH UNASSIGNED REGIONS =================
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/regions`
        );
        const data = await res.json();

        if (data.status === "success") {
          setRegions(
            data.data.filter((r: any) => !r.zoneManagerId)
          );
        }
      } catch (err) {
        console.error("Failed to fetch regions", err);
      }
    };

    fetchRegions();
  }, []);

  const filteredRegions = regions.filter(
    (r) =>
      r.regionName
        .toLowerCase()
        .includes(regionSearch.toLowerCase()) &&
      !selectedRegions.some(
        (sr) => sr.regionId === r.regionId
      )
  );

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || selectedRegions.length === 0) {
      alert("Please fill all required fields");
      return;
    }
    if (phone.length !== 10) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append(
        "regionIds",
        JSON.stringify(selectedRegions.map((r) => r.regionId))
      );

      if (image) {
        formData.append("profile_image", image);
      }

      await api.post("/zonemanager", formData);
      showToast("Zone Manager created successfully", "success");  
      navigate("/zonemanagers");
    } catch (err) {
      console.error(err);
      showToast("Failed to create Zone Manager", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/\D/g, ""); 
  setPhone(value);

  if (value.length > 0 && value.length < 10) {
    setPhoneError("Phone number must be 10 digits");
  } else {
    setPhoneError("");
  }
  };
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <div className={styles.page}>
            <div className={styles.card}>
              <div className={styles.header}>
                <h3>Create Zone Manager</h3>
              </div>

              <form className={styles.form} 
              onSubmit={handleSubmit}>
                {/* ROW 1 */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* ROW 2 */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      maxLength={10}
                      placeholder="Enter 10-digit phone number"
                      onChange={handlePhoneChange}
                    />

                    {phoneError && (
                      <span className={styles.errorText}>{phoneError}</span>
                    )}
                  </div>

                  {/* REGION MULTI SELECT */}
                  <div className={styles.field}>
                    <label>Region</label>

                    <div
                      className={styles.multiSelectInput}
                      onClick={() => setShowRegionDropdown(true)}
                    >
                      {selectedRegions.map((r) => (
                        <span key={r.regionId} className={styles.chip}>
                          {r.regionName}
                          <button
                            type="button"
                            className={styles.chipRemove}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRegions(
                                selectedRegions.filter(
                                  (x) => x.regionId !== r.regionId
                                )
                              );
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      ))}

                      <input
                        className={styles.multiInput}
                        placeholder="Search region..."
                        value={regionSearch}
                        onChange={(e) => {
                          setRegionSearch(e.target.value);
                          setShowRegionDropdown(true);
                        }}
                      />
                    </div>

                    {showRegionDropdown && (
                      <div className={styles.dropdown}>
                        {filteredRegions.length > 0 ? (
                          filteredRegions.map((region) => (
                            <div
                              key={region.regionId}
                              className={styles.dropdownItem}
                              onClick={() => {
                                setSelectedRegions([
                                  ...selectedRegions,
                                  region,
                                ]);
                                setRegionSearch("");
                                setShowRegionDropdown(false);
                              }}
                            >
                              {region.regionName}
                            </div>
                          ))
                        ) : (
                          <div className={styles.dropdownItemMuted}>
                            No regions found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                    <div className={styles.field}>
                      <label>Profile Image</label>

                      <div className={styles.fileInputWrapper}>
                        <label htmlFor="profileImage" className={styles.fileBtn}>
                          Upload
                        </label>

                        <span className={styles.fileText}>
                          {image ? image.name : "No file selected"}
                        </span>

                        <input
                          type="file"
                          id="profileImage"
                          accept="image/*"
                          className={styles.hiddenFileInput}
                          onChange={(e) => setImage(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                {/* FOOTER */}
                <div className={styles.footer}>
                  <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => navigate("/zonemanagers")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={styles.submit}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateZoneManager;
