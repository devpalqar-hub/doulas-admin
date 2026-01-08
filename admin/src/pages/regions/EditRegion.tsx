import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./EditRegion.module.css";
import {
  createRegion,
  fetchRegionById,
  updateRegion,
} from "../../services/region.service";
import { FaArrowLeft } from "react-icons/fa";

const EditRegion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    regionName: "",
    pincode: "",
    district: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
    is_active: true,
  });

  useEffect(() => {
    if (!id) return;

    fetchRegionById(id).then((data) => {
        setForm({
        regionName: data.regionName ?? "",
        pincode: data.pincode ?? "",
        district: data.district ?? "",
        state: data.state ?? "",
        country: data.country ?? "",
        latitude: data.latitude ?? "",
        longitude: data.longitude ?? "",
        is_active: data.is_active ?? true,
        });
    });
    }, [id]);


  const handleSubmit = async () => {
    if (id) {
      await updateRegion(id, form);
    } else {
      await createRegion(form);
    }
    navigate("/regions");
  };

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
        <button
            type="button"
            className={styles.backLink}
            onClick={() => window.history.back()}
        >
            <FaArrowLeft />   Back to List
        </button>
          <h2>{id ? "Edit Region" : "Create Region"}</h2>

          <div className={styles.formGrid}>
            <input
            placeholder="Region Name"
            value={form.regionName}
            onChange={(e) => setForm({ ...form, regionName: e.target.value })}
            />

            <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />

            <input
            placeholder="District"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            />

            <input
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            />

            <input
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            />

            <input
            placeholder="Latitude"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            />

            <input
            placeholder="Longitude"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            />


            <label className={styles.toggleRow}>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              Active
            </label>

            <button type="button" className={styles.primaryBtn} onClick={handleSubmit}>
              Save Region
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRegion;
