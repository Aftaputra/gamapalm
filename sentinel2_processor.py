import rasterio
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib.patches import Patch
import glob
import os


class Sentinel2Processor:
    def __init__(self, data_folder):
        self.data_folder = data_folder

    def extract_sentinel_bands(self, product_path):
        """Cari band Red (B04) & NIR (B08) dari folder .SAFE"""
        band_files = {}
        for root, _, files in os.walk(product_path):
            for file in files:
                if file.endswith(".jp2"):
                    if "B04" in file:  # Red
                        band_files["red"] = os.path.join(root, file)
                    elif "B08" in file:  # NIR
                        band_files["nir"] = os.path.join(root, file)
        return band_files

    def calculate_ndvi(self, red_file, nir_file):
        """Hitung NDVI (float array)"""
        with rasterio.open(red_file) as red:
            red_band = red.read(1).astype("float32")
            profile = red.profile

        with rasterio.open(nir_file) as nir:
            nir_band = nir.read(1).astype("float32")

        # hindari pembagian nol
        ndvi = (nir_band - red_band) / (nir_band + red_band + 1e-6)
        ndvi = np.clip(ndvi, -1, 1)

        return ndvi, profile

    def save_float_ndvi(self, ndvi_array, profile, output_path):
        """Simpan NDVI float (untuk analisis GIS)"""
        profile.update(
            driver="GTiff",
            dtype="float32",
            count=1,
            nodata=-9999.0
        )
        ndvi_out = np.where(np.isnan(ndvi_array), -9999.0, ndvi_array)
        with rasterio.open(output_path, "w", **profile) as dst:
            dst.write(ndvi_out.astype("float32"), 1)

    def save_colored_ndvi(self, ndvi_array, profile, output_path):
        """Simpan NDVI dengan colormap RGB"""
        cmap = plt.get_cmap("RdYlGn")
        norm = plt.Normalize(vmin=-1, vmax=1)
        colored_img = (cmap(norm(ndvi_array))[:, :, :3] * 255).astype(np.uint8)

        new_profile = profile.copy()
        new_profile.update(
            driver="GTiff",
            dtype="uint8",
            count=3,
            photometric="RGB"
        )

        with rasterio.open(output_path, "w", **new_profile) as dst:
            for i in range(3):
                dst.write(colored_img[:, :, i], i + 1)

    def classify_ndvi(self, ndvi_array):
        """Klasifikasi NDVI"""
        classified = np.zeros_like(ndvi_array, dtype=np.uint8)
        classified[(ndvi_array < 0.0)] = 0   # Mati
        classified[(ndvi_array >= 0.0) & (ndvi_array < 0.33)] = 1  # Tidak sehat
        classified[(ndvi_array >= 0.33) & (ndvi_array < 0.66)] = 2  # Cukup sehat
        classified[(ndvi_array >= 0.66)] = 3  # Sangat sehat
        return classified
    def apply_colormap(self, classified_array):
        """Convert classified NDVI ke RGB array untuk preview cepat"""
        colors = {
            0: (165, 42, 42),    # Coklat = Mati
            1: (255, 255, 0),    # Kuning = Tidak sehat
            2: (255, 165, 0),    # Oranye = Cukup sehat
            3: (0, 128, 0)       # Hijau = Sangat sehat
        }

        rgb_img = np.zeros((*classified_array.shape, 3), dtype=np.uint8)
        for k, v in colors.items():
            mask = classified_array == k
            rgb_img[mask] = v

        return rgb_img

    def save_classified_ndvi(self, classified_array, profile, output_path):
        """Simpan peta klasifikasi NDVI RGB"""
        colors = {
            0: (165, 42, 42),    # Coklat = Mati
            1: (255, 255, 0),    # Kuning = Tidak sehat
            2: (255, 165, 0),    # Oranye = Cukup sehat
            3: (0, 128, 0)       # Hijau = Sangat sehat
        }

        rgb_img = np.zeros((*classified_array.shape, 3), dtype=np.uint8)
        for k, v in colors.items():
            mask = classified_array == k
            rgb_img[mask] = v

        new_profile = profile.copy()
        new_profile.update(
            driver="GTiff",
            dtype="uint8",
            count=3,
            photometric="RGB"
        )

        with rasterio.open(output_path, "w", **new_profile) as dst:
            for i in range(3):
                dst.write(rgb_img[:, :, i], i + 1)

    def plot_results(self, ndvi_array, classified_array, output_path):
        """Preview hasil PNG"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

        im1 = ax1.imshow(ndvi_array, cmap="RdYlGn", vmin=-1, vmax=1)
        ax1.set_title("NDVI Map")
        plt.colorbar(im1, ax=ax1, fraction=0.046, pad=0.04)

        colors = ["brown", "yellow", "orange", "green"]
        labels = ["Mati", "Tidak sehat", "Cukup sehat", "Sangat sehat"]
        cmap = mcolors.ListedColormap(colors)
        bounds = [0, 1, 2, 3, 4]
        norm = mcolors.BoundaryNorm(bounds, cmap.N)

        im2 = ax2.imshow(classified_array, cmap=cmap, norm=norm)
        ax2.set_title("Klasifikasi NDVI")
        legend_elements = [Patch(facecolor=colors[i], label=labels[i]) for i in range(len(labels))]
        ax2.legend(handles=legend_elements, loc="lower right")

        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches="tight")
        plt.close()


# === MAIN ===
def main():
    data_folder = "D:/Sentinel2_Riau"
    processor = Sentinel2Processor(data_folder)

    safe_folders = glob.glob(os.path.join(data_folder, "*.SAFE"))
    if not safe_folders:
        print("No .SAFE folders found!")
        return
    latest_safe = safe_folders[0]

    band_files = processor.extract_sentinel_bands(latest_safe)
    if not band_files:
        print("No band files found!")
        return

    print("Bands ditemukan:", band_files)

    ndvi_array, profile = processor.calculate_ndvi(
        band_files["red"], band_files["nir"]
    )

    ndvi_tif = os.path.join(data_folder, "NDVI_Float.tif")
    ndvi_colored_tif = os.path.join(data_folder, "NDVI_Color.tif")
    classified_tif = os.path.join(data_folder, "NDVI_Class.tif")
    preview_png = os.path.join(data_folder, "NDVI_Preview.png")

    processor.save_float_ndvi(ndvi_array, profile, ndvi_tif)
    processor.save_colored_ndvi(ndvi_array, profile, ndvi_colored_tif)

    classified = processor.classify_ndvi(ndvi_array)
    processor.save_classified_ndvi(classified, profile, classified_tif)
    processor.plot_results(ndvi_array, classified, preview_png)

    print("\n=== NDVI STATISTICS ===")
    print(f"Min: {np.nanmin(ndvi_array):.3f}")
    print(f"Max: {np.nanmax(ndvi_array):.3f}")
    print(f"Mean: {np.nanmean(ndvi_array):.3f}")

    pixel_area = 100  # m² (10m resolusi Sentinel-2)
    classes = ["Mati", "Tidak sehat", "Cukup sehat", "Sangat sehat"]
    counts = np.bincount(classified.flatten().astype(int))

    print("\n=== AREA ANALYSIS ===")
    for i, count in enumerate(counts):
        if i < len(classes):
            hectares = (count * pixel_area) / 10000
            print(f"{classes[i]}: {hectares:,.1f} ha")


if __name__ == "__main__":
    main()
