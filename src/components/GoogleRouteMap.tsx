import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Crosshair,
  MapPin,
  Navigation,
  Layers,
  Plane,
  Flame,
  Train,
  CheckCircle2,
  RefreshCw,
  Maximize2,
} from 'lucide-react';
import {
  POPULAR_SPOTS,
  PopularSpot,
  GpsLocationResult,
} from '../utils/locationService.js';
import type { Language } from '../i18n/translations.js';

interface GoogleRouteMapProps {
  pickup: string;
  destination: string;
  userLocation: GpsLocationResult | null;
  onDetectGps: () => void;
  isDetectingGps: boolean;
  onSelectSpot: (spot: PopularSpot, field: 'pickup' | 'destination') => void;
  lang: Language;
}

const DEFAULT_CENTER = { lat: 25.3176, lng: 82.9739 }; // Varanasi City Center
const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

// Internal Route Renderer Component inside Map context
function RoutePolylineRenderer({
  pickup,
  destination,
  userLocation,
}: {
  pickup: string;
  destination: string;
  userLocation: GpsLocationResult | null;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clean up previous polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    // Helper: Find spot coordinates by string matching
    const findCoords = (text: string): { lat: number; lng: number } | null => {
      const lower = text.toLowerCase();
      // If user location match
      if (userLocation && lower.includes('gps')) {
        return { lat: userLocation.latitude, lng: userLocation.longitude };
      }
      const spot = POPULAR_SPOTS.find(
        s =>
          lower.includes(s.nameEn.toLowerCase()) ||
          lower.includes(s.addressString.toLowerCase()) ||
          (lower.includes('airport') && s.category === 'airport') ||
          (lower.includes('cantt') && s.id === 'spot-varanasi-cantt-station') ||
          (lower.includes('ayodhya') && s.id === 'spot-ayodhya-ram-mandir') ||
          ((lower.includes('prayagraj') || lower.includes('sangam')) && s.id === 'spot-prayagraj-sangam') ||
          (lower.includes('sarnath') && s.id === 'spot-sarnath-stupa') ||
          (lower.includes('bodh') && s.id === 'spot-mahabodhi-temple') ||
          (lower.includes('lanka') && s.id === 'spot-lanka-varanasi') ||
          (lower.includes('kashi') && s.id === 'spot-kashi-vishwanath') ||
          (lower.includes('dashashwamedh') && s.id === 'spot-dashashwamedh-ghat')
      );
      return spot ? { lat: spot.lat, lng: spot.lng } : null;
    };

    const originCoords = findCoords(pickup);
    const destCoords = findCoords(destination);

    // If routes library is loaded, calculate real driving route via Route.computeRoutes
    if (routesLib && originCoords && destCoords) {
      const request = {
        origin: { latLng: originCoords },
        destination: { latLng: destCoords },
        travelMode: 'DRIVING' as const,
        fields: ['path', 'viewport', 'distanceMeters', 'durationMillis'],
      };

      try {
        (routesLib.Route as any)
          .computeRoutes(request)
          .then(({ routes }: { routes: any[] }) => {
            if (!routes || routes.length === 0) return;

            const primaryRoute = routes[0];
            const newPolylines = primaryRoute.createPolylines();
            newPolylines.forEach((poly: google.maps.Polyline) => {
              poly.setOptions({
                strokeColor: '#821B25',
                strokeWeight: 5,
                strokeOpacity: 0.9,
              });
              poly.setMap(map);
            });
            polylinesRef.current = newPolylines;

            if (primaryRoute.viewport) {
              map.fitBounds(primaryRoute.viewport);
            }
          })
          .catch((_err: any) => {
            // Fallback: draw straight-line polyline if computeRoutes request fails
            const fallbackPolyline = new google.maps.Polyline({
              path: [originCoords, destCoords],
              strokeColor: '#B5222A',
              strokeWeight: 4,
              strokeOpacity: 0.8,
              geodesic: true,
              map: map,
            });
            polylinesRef.current = [fallbackPolyline];

            const bounds = new google.maps.LatLngBounds();
            bounds.extend(originCoords);
            bounds.extend(destCoords);
            map.fitBounds(bounds);
          });
      } catch (_err) {
        // Fallback straight-line
        const fallbackPolyline = new google.maps.Polyline({
          path: [originCoords, destCoords],
          strokeColor: '#821B25',
          strokeWeight: 4,
          strokeOpacity: 0.8,
          geodesic: true,
          map: map,
        });
        polylinesRef.current = [fallbackPolyline];
      }
    } else if (originCoords && destCoords) {
      // Direct polyline before routes library is ready
      const fallbackPolyline = new google.maps.Polyline({
        path: [originCoords, destCoords],
        strokeColor: '#821B25',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        geodesic: true,
        map: map,
      });
      polylinesRef.current = [fallbackPolyline];

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(originCoords);
      bounds.extend(destCoords);
      map.fitBounds(bounds);
    }

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, routesLib, pickup, destination, userLocation]);

  return null;
}

// Center Controller Hook to pan to user location
function MapPanController({
  targetCoords,
}: {
  targetCoords: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
      map.setZoom(14);
    }
  }, [map, targetCoords]);

  return null;
}

export const GoogleRouteMap: React.FC<GoogleRouteMapProps> = ({
  pickup,
  destination,
  userLocation,
  onDetectGps,
  isDetectingGps,
  onSelectSpot,
  lang,
}) => {
  const [selectedSpot, setSelectedSpot] = useState<PopularSpot | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [panTarget, setPanTarget] = useState<{ lat: number; lng: number } | null>(null);

  // Identify pickup and drop coords
  const pickupSpot = useMemo(() => {
    const p = pickup.toLowerCase();
    return POPULAR_SPOTS.find(
      s =>
        p.includes(s.nameEn.toLowerCase()) ||
        s.addressString.toLowerCase().includes(p) ||
        (p.includes('airport') && s.category === 'airport') ||
        (p.includes('lanka') && s.id === 'spot-lanka-varanasi') ||
        (p.includes('cantt') && s.id === 'spot-varanasi-cantt-station') ||
        (p.includes('kashi') && s.id === 'spot-kashi-vishwanath') ||
        (p.includes('dashashwamedh') && s.id === 'spot-dashashwamedh-ghat')
    ) || POPULAR_SPOTS[8];
  }, [pickup]);

  const dropSpot = useMemo(() => {
    const d = destination.toLowerCase();
    return POPULAR_SPOTS.find(
      s =>
        d.includes(s.nameEn.toLowerCase()) ||
        s.addressString.toLowerCase().includes(d) ||
        (d.includes('ayodhya') && s.id === 'spot-ayodhya-ram-mandir') ||
        ((d.includes('sangam') || d.includes('prayagraj')) && s.id === 'spot-prayagraj-sangam') ||
        (d.includes('sarnath') && s.id === 'spot-sarnath-stupa') ||
        (d.includes('bodh') && s.id === 'spot-mahabodhi-temple') ||
        (d.includes('airport') && s.id === 'spot-babatpur-airport') ||
        (d.includes('kashi') && s.id === 'spot-kashi-vishwanath')
    ) || POPULAR_SPOTS[3];
  }, [destination]);

  const handleGpsCenter = () => {
    onDetectGps();
    if (userLocation) {
      setPanTarget({ lat: userLocation.latitude, lng: userLocation.longitude });
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#C69A52]/40 shadow-md overflow-hidden flex flex-col">
      {/* Top Map Header Controls */}
      <div className="p-3 bg-[#FFFDF7] border-b border-[#C69A52]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#821B25] text-white flex items-center justify-center font-bold">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#821B25] text-xs sm:text-sm">
              {lang === 'hi' ? 'गूगल मैप्स लाइव मार्ग एवं GPS' : 'Google Maps Live Route & GPS'}
            </h4>
            <span className="text-[10px] text-[#292321]/60">
              {lang === 'hi'
                ? 'तीर्थ स्थल, एयरपोर्ट टर्मिनल और लाइव GPS स्थान'
                : 'Interactive route path, pilgrimage shrines & GPS tracking'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Map Layer Switcher */}
          <button
            type="button"
            onClick={() => setMapType(prev => (prev === 'roadmap' ? 'hybrid' : 'roadmap'))}
            className="px-2.5 py-1 bg-stone-100 hover:bg-[#F3E8D5] text-[#292321] rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="Toggle satellite/roadmap view"
          >
            <Layers className="w-3.5 h-3.5 text-[#821B25]" />
            <span>{mapType === 'roadmap' ? 'Satellite' : 'Roadmap'}</span>
          </button>

          {/* Center to My GPS Button */}
          <button
            type="button"
            onClick={handleGpsCenter}
            disabled={isDetectingGps}
            className="px-2.5 py-1 bg-[#821B25] hover:bg-[#B5222A] text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-xs"
            title="Detect phone GPS and center map"
          >
            {isDetectingGps ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>{lang === 'hi' ? 'मेरा GPS' : 'Locate GPS'}</span>
          </button>
        </div>
      </div>

      {/* Google Map Container */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-stone-100">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'routes']}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={11}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
          >
            {/* Route Polyline Renderer */}
            <RoutePolylineRenderer
              pickup={pickup}
              destination={destination}
              userLocation={userLocation}
            />

            {/* Pan Target Controller */}
            <MapPanController targetCoords={panTarget} />

            {/* User GPS Location Marker */}
            {userLocation && (
              <AdvancedMarker
                position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                title="Your Phone GPS Location"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <Crosshair className="w-3.5 h-3.5" />
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Pickup Marker */}
            {pickupSpot && (
              <AdvancedMarker
                position={{ lat: pickupSpot.lat, lng: pickupSpot.lng }}
                title={`Pickup: ${pickupSpot.nameEn}`}
              >
                <Pin
                  background="#16a34a"
                  borderColor="#14532d"
                  glyphColor="#ffffff"
                  scale={1.1}
                />
              </AdvancedMarker>
            )}

            {/* Drop / Destination Marker */}
            {dropSpot && (
              <AdvancedMarker
                position={{ lat: dropSpot.lat, lng: dropSpot.lng }}
                title={`Drop: ${dropSpot.nameEn}`}
              >
                <Pin
                  background="#dc2626"
                  borderColor="#7f1d1d"
                  glyphColor="#ffffff"
                  scale={1.1}
                />
              </AdvancedMarker>
            )}

            {/* Popular Shrines and Airport Markers across Region */}
            {POPULAR_SPOTS.map(spot => {
              const isOrigin = pickupSpot?.id === spot.id;
              const isDest = dropSpot?.id === spot.id;
              if (isOrigin || isDest) return null; // already rendered with custom colored pins

              return (
                <AdvancedMarker
                  key={spot.id}
                  position={{ lat: spot.lat, lng: spot.lng }}
                  onClick={() => setSelectedSpot(spot)}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 border border-white shadow-md flex items-center justify-center text-white text-[10px] cursor-pointer hover:scale-110 transition-transform">
                    {spot.category === 'airport' ? '✈️' : spot.category === 'transit' ? '🚆' : '🛕'}
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for tapped spots on the map */}
            {selectedSpot && (
              <InfoWindow
                position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }}
                onCloseClick={() => setSelectedSpot(null)}
              >
                <div className="p-1 max-w-[200px] text-[#292321] space-y-1.5">
                  <div className="font-bold text-xs text-[#821B25]">
                    {lang === 'hi' ? selectedSpot.nameHi : selectedSpot.nameEn}
                  </div>
                  <div className="h-16 w-full rounded overflow-hidden">
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-stone-600 leading-tight">
                    {selectedSpot.description}
                  </p>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSpot(selectedSpot, 'pickup');
                        setSelectedSpot(null);
                      }}
                      className="px-1.5 py-0.5 bg-[#821B25] text-white rounded text-[9px] font-bold"
                    >
                      Set Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSpot(selectedSpot, 'destination');
                        setSelectedSpot(null);
                      }}
                      className="px-1.5 py-0.5 bg-[#F3E8D5] text-[#821B25] rounded text-[9px] font-bold"
                    >
                      Set Drop
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Live GPS Status Pill floating on Map */}
        {userLocation && (
          <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GPS Active (±{userLocation.accuracy}m)</span>
          </div>
        )}
      </div>

      {/* Legend and Map Footer */}
      <div className="px-3 py-2 bg-[#FFFDF7] border-t border-[#C69A52]/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#292321]/75">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Pickup: {pickupSpot?.nameEn || pickup}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            <span>Drop: {dropSpot?.nameEn || destination}</span>
          </span>
        </div>

        <span className="text-[10px] text-[#821B25] font-semibold">
          Tap any marker on the map to set as Pickup or Drop
        </span>
      </div>
    </div>
  );
};
