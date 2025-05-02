// src/components/ServiceLinks.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaSpotify, FaApple, FaYoutube } from 'react-icons/fa'
import axios from 'axios'

/**
 * Build a link with your standardized UTM scheme,
 * preserving any existing query params.
 */
function generateSmartLink(platform, baseUrl, slug) {
  if (!baseUrl) return null

  try {
    const url = new URL(baseUrl)
    const utm = new URLSearchParams({
      utm_source: 'smartlink',
      utm_medium: platform,
      utm_campaign: slug,
      ref: slug,
      source: 'landing_page',
    })
    // merge any pre‑existing params
    url.searchParams.forEach((val, key) => {
      if (!utm.has(key)) utm.set(key, val)
    })
    url.search = utm.toString()
    return url.toString()
  } catch {
    return baseUrl
  }
}

/**
 * Map platform keys to icons and labels.
 */
const PLATFORM_META = {
  spotify:  { icon: <FaSpotify />, label: 'Spotify' },
  apple:    { icon: <FaApple />,   label: 'Apple Music' },
  youtube:  { icon: <FaYoutube />, label: 'YouTube' },
  // …add others as needed
}

/**
 * ServiceLinks renders a grid of buttons for each available service.
 */
export default function ServiceLinks({ slug, serviceLinks }) {
  const handleClick = async (platform, url) => {
    // fire-and-forget click tracking
    axios.post(`/campaigns/track/${slug}`, { platform })
      .catch(() => {/* swallow errors */})

    // then navigate
    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {Object.entries(serviceLinks).map(([platform, baseUrl]) => {
        if (!baseUrl) return null
        const smartUrl = generateSmartLink(platform, baseUrl, slug)
        const { icon, label } = PLATFORM_META[platform] || {
          icon: null,
          label: platform.charAt(0).toUpperCase() + platform.slice(1)
        }
        return (
          <button
            key={platform}
            onClick={() => handleClick(platform, smartUrl)}
            className={
              `flex items-center justify-center gap-2
               w-full py-3 rounded-lg
               bg-indigo-600 hover:bg-indigo-700
               text-white font-medium transition`
            }
          >
            {icon}
            {label}
          </button>
        )
      })}
    </div>
  )
}

ServiceLinks.propTypes = {
  slug:           PropTypes.string.isRequired,
  serviceLinks:   PropTypes.objectOf(PropTypes.string).isRequired,
}
