# 🛠️ PrivacyHub Scripts

Utility scripts and tools for PrivacyHub development.

## 📦 Available Scripts

### `generate-favicon.html` - Favicon Generator

Interactive tool to generate all required favicon sizes with Poppins Black font.

**Features:**
- ✅ Uses Poppins Black font (matching logo)
- ✅ Generates all required sizes (512×512, 192×192, 180×180, 32×32, 16×16)
- ✅ Live preview with customizable colors
- ✅ Color presets for quick selection
- ✅ One-click download all favicons
- ✅ Rounded corners matching brand style

**Usage:**

1. **Open the generator:**
   ```bash
   open scripts/generate-favicon.html
   ```

2. **Customize colors:**
   - Use color pickers to change background/text colors
   - Or click preset color swatches for quick themes
   - Preview updates in real-time

3. **Download favicons:**
   - Click "Download All Favicons" button
   - Files will download to your Downloads folder
   - Move them to `/public` folder to replace existing favicons

4. **Apply changes:**
   ```bash
   # Move downloaded files to public folder
   mv ~/Downloads/android-chrome-512x512.png public/
   mv ~/Downloads/android-chrome-192x192.png public/
   mv ~/Downloads/apple-touch-icon.png public/
   mv ~/Downloads/favicon-32x32.png public/
   mv ~/Downloads/favicon-16x16.png public/

   # Hard refresh browser to see changes
   # Chrome/Edge: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   # Safari: Cmd+Option+R
   ```

**Recommended Colors:**
- **Background**: `#3b82f6` (Blue 500) - Default
- **Text**: `#ffffff` (White) - Default
- **Alternative**: Gradient `#2563eb` → `#7c3aed` (Blue-Purple)

**Generated Files:**
- `android-chrome-512x512.png` - Android home screen
- `android-chrome-192x192.png` - Android PWA
- `apple-touch-icon.png` (180×180) - iOS home screen
- `favicon-32x32.png` - Desktop browsers
- `favicon-16x16.png` - Desktop browsers (small)

**Note**: Don't forget to update `favicon.ico` if needed (16×16 or 32×32 ICO format).

---

## 📝 Adding New Scripts

When adding new utility scripts to this folder:

1. Create the script file
2. Document it in this README
3. Add usage instructions
4. Update `.gitignore` if needed (for output files)

---

**Maintained by**: PrivacyHub Team
**Last Updated**: 2025-10-16
