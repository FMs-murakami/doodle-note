# Documentation Site Fixes - Implementation Guide

## Overview

This document outlines the fixes implemented to address the issues with the documentation site's sidebar, image display, table alignment, and page titles.

## Issues Fixed

### ✅ 1. Sidebar Collapsible Menus
**Problem**: Category toggle buttons were not working
**Solution**: 
- Updated server-side navigation generation to use `data-category` attributes instead of `onclick` handlers
- Unified HTML structure between client-side and server-side navigation generation
- Fixed event delegation in SidebarManager class

### ✅ 2. Consistent Sidebar Content
**Problem**: Sidebar content changed between pages
**Solution**:
- Modified client-side navigation to load configuration from `config/config.json`
- Updated both client and server navigation to use identical hierarchical structure
- Ensured consistent HTML output across all pages

### ✅ 3. Image Display
**Problem**: Images with paths like `../docs/./sample01.png` not displaying
**Solution**:
- Enhanced image path resolution in markdown processing
- Added proper path normalization to handle complex relative paths
- Updated build process to copy `docs/` directory for image assets

### ✅ 4. Table Alignment
**Problem**: Markdown table alignment syntax not supported
**Solution**:
- Added CSS classes for table alignment: `.text-left`, `.text-center`, `.text-right`
- Enhanced markdown renderer to detect alignment syntax and apply appropriate classes
- Supports standard markdown alignment syntax (`:---`, `:---:`, `---:`)

### ✅ 5. Page Title Removal
**Problem**: Unwanted page titles in content headers
**Solution**:
- Removed page title headers from templates
- Updated build scripts to exclude page titles from generated pages
- Preserved titles in document metadata and breadcrumbs

## Files Modified

### Core Scripts
- `scripts/sidebar.js` - Navigation generation with proper HTML structure
- `scripts/markdown.js` - Image path resolution and table alignment
- `scripts/build.js` - Asset copying and template processing

### Client-Side Code
- `assets/js/main.js` - Configuration loading and navigation generation
- `assets/js/sidebar.js` - Interactive functionality (unchanged, but now works correctly)

### Styling
- `assets/css/style.css` - Added table alignment classes

### Templates
- `templates/page.html` - Removed page title headers

## Testing

### Run Unit Tests
```bash
node tests/test_fixes.js
```

### Run Integration Tests
```bash
node tests/test_integration_fixes.js
```

### Manual Testing

1. **Sidebar Functionality**:
   - Navigate between pages - sidebar content should remain consistent
   - Click category toggles - should expand/collapse properly
   - Search functionality should work on all pages

2. **Image Display**:
   - Check `docs/README.md` - image should display correctly
   - Verify images work from pages in subdirectories

3. **Table Alignment**:
   - View tables in markdown files
   - Verify left, center, and right alignment work as expected

4. **Page Titles**:
   - Confirm page titles are removed from content headers
   - Verify titles still appear in browser tabs and breadcrumbs

## Build Process

### Development
```bash
# Start development server
npm run dev
```

### Production Build
```bash
# Build the site
npm run build
```

The build process now:
- Copies `docs/` directory for image assets
- Copies `config/` directory for client-side configuration loading
- Generates consistent navigation across all pages
- Processes markdown with proper image paths and table alignment

## Configuration

The site uses a hierarchical configuration structure in `config/config.json`:

```json
{
  "site": {
    "title": "社内手順書・仕様書",
    "description": "社内向け技術文書管理システム"
  },
  "pages": [
    {
      "path": "docs/README.md",
      "title": "README"
    },
    {
      "category": "カテゴリ名",
      "pages": [
        {
          "path": "docs/category/page.md",
          "title": "ページタイトル"
        }
      ]
    }
  ]
}
```

## Markdown Features

### Image Syntax
```markdown
![Alt text](./image.png)
![Alt text](../docs/image.png)
![Alt text](https://example.com/image.png)
```

### Table Alignment
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L1   |   C1   |    R1 |
| L2   |   C2   |    R2 |
```

## Browser Compatibility

All fixes maintain compatibility with:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Screen readers and accessibility tools

## Troubleshooting

### Sidebar Not Working
- Check browser console for JavaScript errors
- Verify `config/config.json` is accessible
- Ensure navigation HTML structure is consistent

### Images Not Displaying
- Verify image files exist in `docs/` directory
- Check image paths in markdown files
- Confirm build process copied `docs/` directory

### Table Alignment Not Working
- Check if CSS classes are applied to table cells
- Verify markdown table syntax is correct
- Confirm CSS file includes alignment classes

## Future Maintenance

### Adding New Pages
1. Add markdown file to appropriate directory
2. Update `config/config.json` with page entry
3. Rebuild the site

### Adding New Categories
1. Create category structure in `config/config.json`
2. Add pages to the category
3. Rebuild the site

### Modifying Styles
- Table alignment: Modify CSS classes in `assets/css/style.css`
- Navigation: Update styles for `.nav-category` and related classes
- General styling: Follow existing CSS variable system

## Support

For issues or questions about these fixes:
1. Check the test files for expected behavior
2. Review the SOLUTION_SUMMARY.md for technical details
3. Verify configuration structure matches expected format