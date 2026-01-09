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
import { useToast } from "../../shared/toast/ToastContext";

const EditRegion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {showToast} = useToast();
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

const isFormValid = (): boolean => {
  return [
    form.regionName,
    form.pincode,
    form.district,
    form.state,
    form.country,
    form.latitude,
    form.longitude,
  ].every((field) => field.trim() !== "");
};

  const handleSubmit = async () => {
    if (!isFormValid()) {
      showToast("Fill all fields before submitting", "error");
      return;
    }

    try {
      if (id) {
        await updateRegion(id, form);
        showToast("Region updated successfully", "success");
      } else {
        await createRegion(form);
        showToast("Region created successfully", "success");
      }
      navigate("/regions");
    } catch (err) {
      console.error(err);
      showToast("Failed to save region", "error");
    }
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
            <div className={styles.field}>
              <h5>Region</h5>
              <input
              placeholder="Region Name"
              value={form.regionName}
              onChange={(e) => setForm({ ...form, regionName: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <h5>Pincode</h5>
              <input
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />
            </div>
            <div className={styles.field}>
              <h5>District</h5>
              <input
                placeholder="District"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
               />
            </div>
            <div className={styles.field}>
              <h5>State</h5>
              <input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <h5>Country</h5>
                <input
                placeholder="Country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
            </div>
            <div className={styles.field}>
              <h5>Latitude</h5>
            <input
              placeholder="Latitude"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            />
            </div>
            <div className={styles.field}>
              <h5>Longitude</h5>
              <input
                placeholder="Longitude"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                />
            </div>

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
