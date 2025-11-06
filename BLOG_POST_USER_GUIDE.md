# Quick Reference: Using Blog Post Firestore Features

## Creating a New Post

1. Navigate to `/create-post` (must be logged in)
2. Fill in:
   - **Title** (required) - Generates SEO-optimized slug automatically
   - **Short Description** - Inline meta description (max 160 chars)
   - **Main Content** - Use rich text editor
   - **Content Blocks** - Click "Add Content Block" for structured sections
3. Upload featured image:
   - Click the dashed box or drag & drop
   - Accepts PNG/JPG up to 10MB
4. Complete right sidebar:
   - **Primary Asset** (required) - e.g., AAPL, BTC, EUR/USD
   - Related assets, sentiment, confidence, time horizon
   - Tags, SEO metadata
5. Click **"Save Draft"**
   - Post saves to Firestore
   - URL updates with post ID: `/create-post?id=abc123`
   - Featured image uploads to Firebase Storage

## Editing a Draft

1. Navigate to `/create-post?id=YOUR_POST_ID`
   - Or click edit from your drafts list (if implemented)
2. Make changes
3. Click **"Save Draft"** to update

## Publishing a Post

1. Ensure all required fields are filled:
   - Title
   - Content
   - Primary Asset
2. Click **"Publish"**
   - Sets `isDraft: false`
   - Sets `publishedAt` timestamp
   - Redirects to `/blog`

## Auto-Save

- Automatically saves every 30 seconds
- Only works after first manual save (needs post ID)
- Shows "Saving..." indicator in header
- Uploads featured image if changed

## Preview Mode

- Click **"Preview"** button to see how post will look when published
- Shows:
  - Featured image
  - Meta description
  - All content blocks
  - Tags, assets, time horizon
  - Engagement actions

## Status Indicators

### Header Status
- **"Saving..."** - Auto-save or manual save in progress
- **"Uploading image... X%"** - Featured image upload progress
- Buttons disabled during save/upload

### Right Sidebar
- **Success Metrics**:
  - Quality Score (based on content completeness)
  - Completeness % (required fields filled)
  - SEO Grade (keyword optimization)
  - Readability % (content analysis)

## Content Blocks

Available block types:
1. **Key Takeaways** - Executive summary with bullet points
2. **Technical Setup** - Chart analysis and indicators
3. **Fundamental Drivers** - Economic and company data
4. **Trade Recommendation** - Entry/exit, stop loss, targets
5. **Risk Analysis** - Risk factors and hedging strategies
6. **Broader Market View** - Sector correlation and macro context
7. **Plain Section** - Content without a title header

Each block:
- Has its own rich text editor
- Can be reordered via drag & drop (grab handle on left)
- Can be removed (X button on right)
- Renders separately in preview mode

## Keyboard Shortcuts

- **Enter** on tag/asset input - Add tag/asset
- **Space/Enter** on image placeholder - Open file picker
- **Drag** block handle - Reorder blocks

## Data Validation

### On Save Draft:
- Must be authenticated
- No required fields (can save partial drafts)

### On Publish:
- Must have: title, content, primary asset
- Featured image recommended but not required

### Featured Image:
- File types: PNG, JPG only
- Max size: 10MB
- Validates before upload

## Firestore Data Location

- **Collection**: `posts`
- **Document ID**: Auto-generated or provided
- **Featured Images**: `gs://your-bucket/blog-images/`

## Common URLs

- Create new post: `/create-post`
- Edit existing: `/create-post?id={postId}`
- After publish: redirects to `/blog`
- Login redirect: `/login?redirect=/create-post`

## Tips

1. **Save early, save often** - Click "Save Draft" before making major changes
2. **Use preview** - Check formatting before publishing
3. **SEO optimization** - Fill focus keyword and meta description for better search visibility
4. **Image quality** - Use high-quality featured images (16:9 aspect ratio recommended)
5. **Content blocks** - Use structured blocks for better readability and SEO
6. **Tags** - Add relevant tags for better discoverability
7. **Related assets** - Help readers find connected analysis

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Must be logged in" error | Navigate to `/login` and authenticate |
| Image upload fails | Check file size (<10MB) and type (PNG/JPG) |
| Save button disabled | Wait for current save/upload to complete |
| Post not loading | Verify post ID in URL is correct |
| Changes not saving | Check browser console for errors, verify Firebase connection |
| Auto-save not working | Save manually first to generate post ID |
