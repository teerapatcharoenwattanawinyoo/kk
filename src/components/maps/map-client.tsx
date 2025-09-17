"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface MapClientProps {
  width?: string;
  height?: string;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  initialCoordinates?: { lat: number; lng: number };
  initialAddress?: string;
}

const defaultIcon = L.icon({
  iconUrl: "/assets/images/icons/pinmaps.svg",
  iconRetinaUrl: "/assets/images/icons/pinmaps.svg",
  shadowUrl: "/assets/images/marker-shadow.png",
});

export default function MapClient({
  width = "w-full",
  height = "h-[400px]",
  onCoordinatesChange,
  onAddressChange,
  initialCoordinates,
  initialAddress,
}: MapClientProps) {
  const { t } = useI18n();
  // Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isCleaningUpRef = useRef(false);

  // State
  const [latitude, setLatitude] = useState<number | null>(
    initialCoordinates?.lat ?? null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    initialCoordinates?.lng ?? null,
  );
  const [address, setAddress] = useState<string>(initialAddress ?? "");
  const [currentLocationName, setCurrentLocationName] =
    useState<string>("ตำแหน่งปัจจุบัน");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{
      display_name: string;
      lat: number;
      lon: number;
      type?: string;
      importance?: number;
      place_id?: string;
      addresstype?: string;
      class?: string;
      boundingbox?: string[];
    }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isPinMode, setIsPinMode] = useState(false);

  // Safe cleanup function
  const cleanupMap = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    try {
      if (markerRef.current) {
        markerRef.current = null;
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    } catch (error) {
      console.error("Error during map cleanup:", error);
    } finally {
      isCleaningUpRef.current = false;
    }
  }, []);

  // Reverse geocode when coordinates change manually
  const handleCoordinateChange = useCallback(
    async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        );
        const data = await response.json();
        if (data && data.display_name) {
          setCurrentLocationName(data.display_name);
          setAddress(data.display_name);

          // Call callbacks if provided
          onCoordinatesChange?.(
            parseFloat(lat.toFixed(4)),
            parseFloat(lng.toFixed(4)),
          );
          onAddressChange?.(data.display_name);

          // Update marker popup if exists
          if (
            markerRef.current &&
            mapInstanceRef.current &&
            mapInstanceRef.current.hasLayer(markerRef.current)
          ) {
            markerRef.current.bindPopup(data.display_name).openPopup();
          }
        } else {
          const fallbackName = "ตำแหน่งที่ระบุ";
          setCurrentLocationName(fallbackName);
          setAddress(fallbackName);

          // Call callbacks if provided
          onCoordinatesChange?.(
            parseFloat(lat.toFixed(4)),
            parseFloat(lng.toFixed(4)),
          );
          onAddressChange?.(fallbackName);

          if (
            markerRef.current &&
            mapInstanceRef.current &&
            mapInstanceRef.current.hasLayer(markerRef.current)
          ) {
            markerRef.current.bindPopup(fallbackName).openPopup();
          }
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        const fallbackName = "ตำแหน่งที่ระบุ";
        setCurrentLocationName(fallbackName);
        setAddress(fallbackName);

        // Call callbacks if provided
        onCoordinatesChange?.(lat, lng);
        onAddressChange?.(fallbackName);

        if (
          markerRef.current &&
          mapInstanceRef.current &&
          mapInstanceRef.current.hasLayer(markerRef.current)
        ) {
          markerRef.current.bindPopup(fallbackName).openPopup();
        }
      }
    },
    [onCoordinatesChange, onAddressChange],
  );

  // Get current location on component mount
  useEffect(() => {
    // If initial coordinates provided, use them instead of geolocation
    if (
      initialCoordinates &&
      initialCoordinates.lat !== 0 &&
      initialCoordinates.lng !== 0
    ) {
      setLatitude(initialCoordinates.lat);
      setLongitude(initialCoordinates.lng);
      if (initialAddress) {
        setAddress(initialAddress);
        setCurrentLocationName(initialAddress);
      }
      setIsLoadingLocation(false);
      return;
    }

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to Bangkok coordinates
      const fallbackLat = 14.036819554634077;
      const fallbackLng = 100.72799595062057;
      const fallbackAddress = "กรุงเทพมหานคร (ตำแหน่งเริ่มต้น)";

      setLatitude(fallbackLat);
      setLongitude(fallbackLng);
      setCurrentLocationName(fallbackAddress);
      setAddress(fallbackAddress);
      setIsLoadingLocation(false);

      // Call callbacks with fallback coordinates
      onCoordinatesChange?.(
        parseFloat(fallbackLat.toFixed(4)),
        parseFloat(fallbackLng.toFixed(4)),
      );
      onAddressChange?.(fallbackAddress);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: currentLat, longitude: currentLng } = position.coords;
        setLatitude(currentLat);
        setLongitude(currentLng);

        // Get location name from coordinates
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLng}&zoom=14&addressdetails=1`,
          );
          const data = await response.json();
          if (data && data.display_name) {
            setCurrentLocationName(data.display_name);
            setAddress(data.display_name);
            onAddressChange?.(data.display_name);
          } else {
            const fallbackName = "ตำแหน่งปัจจุบัน";
            setCurrentLocationName(fallbackName);
            setAddress(fallbackName);
            onAddressChange?.(fallbackName);
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          const fallbackName = "ตำแหน่งปัจจุบัน";
          setCurrentLocationName(fallbackName);
          setAddress(fallbackName);
          onAddressChange?.(fallbackName);
        }

        // Call coordinates callback
        onCoordinatesChange?.(
          parseFloat(currentLat.toFixed(4)),
          parseFloat(currentLng.toFixed(4)),
        );
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        // Fallback to Bangkok coordinates if location access fails
        const fallbackLat = 14.036819554634077;
        const fallbackLng = 100.72799595062057;
        const fallbackAddress = "กรุงเทพมหานคร (ตำแหน่งเริ่มต้น)";

        setLatitude(fallbackLat);
        setLongitude(fallbackLng);
        setCurrentLocationName(fallbackAddress);
        setAddress(fallbackAddress);
        setIsLoadingLocation(false);

        // Call callbacks with fallback coordinates
        onCoordinatesChange?.(
          parseFloat(fallbackLat.toFixed(4)),
          parseFloat(fallbackLng.toFixed(4)),
        );
        onAddressChange?.(fallbackAddress);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, [
    initialCoordinates,
    initialAddress,
    onCoordinatesChange,
    onAddressChange,
  ]);

  // Initialize map and handle location
  useEffect(() => {
    if (!mapRef.current || latitude === null || longitude === null) return;

    // Cleanup any existing map first
    cleanupMap();

    // Add small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!mapRef.current || isCleaningUpRef.current) return;

      try {
        // Create map instance
        const map = L.map(mapRef.current).setView([latitude, longitude], 13);
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Set default cursor
        map.getContainer().style.cursor = "grab";

        // Add marker
        const marker = L.marker([latitude, longitude], {
          icon: defaultIcon,
        }).addTo(map);
        markerRef.current = marker;

        // Bind popup
        const popupContent = address || currentLocationName;
        marker.bindPopup(popupContent).openPopup();

        // Handle map clicks for pin mode
        map.on("click", async (e: L.LeafletMouseEvent) => {
          if (!isPinMode) return;

          const { lat, lng } = e.latlng;

          // Remove existing marker
          if (markerRef.current && map.hasLayer(markerRef.current)) {
            map.removeLayer(markerRef.current);
          }

          // Add new marker
          const newMarker = L.marker([lat, lng], { icon: defaultIcon }).addTo(
            map,
          );
          markerRef.current = newMarker;
          newMarker.bindPopup("กำลังค้นหาที่อยู่...").openPopup();

          // Update coordinates and address
          setLatitude(parseFloat(lat.toFixed(4)));
          setLongitude(parseFloat(lng.toFixed(4)));
          await handleCoordinateChange(
            parseFloat(lat.toFixed(4)),
            parseFloat(lng.toFixed(4)),
          );

          // Exit pin mode
          setIsPinMode(false);
          map.getContainer().style.cursor = "grab";
        });

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      cleanupMap();
    };
  }, [
    latitude,
    longitude,
    address,
    currentLocationName,
    isPinMode,
    handleCoordinateChange,
    cleanupMap,
  ]);

  useEffect(() => {
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clear any pending search timeouts
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      cleanupMap();
    };
  }, [cleanupMap]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search addresses function for live suggestions
  const searchAddresses = async (addressText: string) => {
    if (!addressText.trim() || addressText.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsGeocodingLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressText,
        )}&limit=5&addressdetails=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const results = data.map(
          (result: {
            lat: string;
            lon: string;
            display_name: string;
            type?: string;
            importance?: number;
            place_id?: string;
            addresstype?: string;
            class?: string;
            boundingbox?: string[];
          }) => {
            const {
              lat,
              lon,
              display_name,
              type,
              importance,
              place_id,
              addresstype,
              class: placeClass,
              boundingbox,
            } = result;

            return {
              display_name,
              lat: parseFloat(lat),
              lon: parseFloat(lon),
              type,
              importance,
              place_id,
              addresstype,
              class: placeClass,
              boundingbox,
            };
          },
        );
        setSearchResults(results);
        setShowSuggestions(true);
        setSelectedSuggestionIndex(-1);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  // Select a search result
  const selectSearchResult = (result: (typeof searchResults)[0]) => {
    const roundedLat = parseFloat(result.lat.toFixed(4));
    const roundedLng = parseFloat(result.lon.toFixed(4));

    setLatitude(roundedLat);
    setLongitude(roundedLng);
    setAddress(result.display_name);
    setCurrentLocationName(result.display_name); // Update current location name
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    // Call callbacks if provided
    onCoordinatesChange?.(roundedLat, roundedLng);
    onAddressChange?.(result.display_name);

    // Update map view and marker
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([roundedLat, roundedLng], 15);

      // Remove existing marker
      if (
        markerRef.current &&
        mapInstanceRef.current &&
        mapInstanceRef.current.hasLayer(markerRef.current)
      ) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      // Add new marker
      const newMarker = L.marker([roundedLat, roundedLng], {
        icon: defaultIcon,
      }).addTo(mapInstanceRef.current);

      markerRef.current = newMarker;
      newMarker.bindPopup(result.display_name).openPopup();
    }
  };

  // Geocoding function to convert address to coordinates
  const geocodeAddress = async (addressText: string) => {
    if (!addressText.trim()) return;

    setIsGeocodingLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressText,
        )}&limit=1`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        selectSearchResult({
          display_name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          type: result.type,
          importance: result.importance,
          place_id: result.place_id,
          addresstype: result.addresstype,
          class: result.class,
          boundingbox: result.boundingbox,
        });
      } else {
        alert("ไม่พบที่อยู่ที่ระบุ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("เกิดข้อผิดพลาดในการค้นหาที่อยู่");
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  // Handle address search with keyboard navigation
  const handleAddressSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (
        selectedSuggestionIndex >= 0 &&
        searchResults[selectedSuggestionIndex]
      ) {
        selectSearchResult(searchResults[selectedSuggestionIndex]);
      } else {
        geocodeAddress(address);
      }
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggestions && searchResults.length > 0) {
        setSelectedSuggestionIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0,
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggestions && searchResults.length > 0) {
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1,
        );
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Handle address input change with longer debounce
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Clear suggestions immediately if input is too short
    if (value.length < 3) {
      setSearchResults([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      return;
    }

    // Set longer timeout for search to allow more typing
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        searchAddresses(value);
      }
    }, 800); // 800ms debounce - longer delay for more typing freedom
  };

  return (
    <div className="space-y-6">
      {/* Address Search Section */}

      <div className="relative space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            {t("charging-stations.address")}
          </Label>
          <div className="relative" ref={searchContainerRef}>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={handleAddressChange}
              onKeyDown={handleAddressSearch}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder={t("charging-stations.address_placeholder")}
              disabled={isGeocodingLoading}
              className="h-10 w-full border-none bg-[#f2f2f2] sm:h-11"
            />

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchResults.length > 0 && (
              <Card className="z-9999 absolute left-0 right-0 top-full mt-1 max-h-60 overflow-hidden shadow-xl">
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={result.place_id || index}
                      className={`cursor-pointer border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-accent ${
                        selectedSuggestionIndex === index ? "bg-accent" : ""
                      }`}
                      onClick={() => selectSearchResult(result)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {result.display_name.split(",")[0]}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {result.display_name}
                          </p>
                        </div>
                        <div className="ml-2 text-right">
                          <p className="font-mono text-xs text-muted-foreground">
                            {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Spacer to prevent overlap when dropdown is open */}
        {showSuggestions && searchResults.length > 0 && (
          <div className="h-20"></div>
        )}
      </div>

      {/* Map container */}
      <div className="relative">
        <div ref={mapRef} className={`${width} ${height} rounded-lg border`}>
          {isLoadingLocation && (
            <div className="flex h-full items-center justify-center rounded-lg bg-muted">
              <Card className="p-6">
                <CardContent className="flex flex-col items-center space-y-4 p-0">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-center text-muted-foreground">
                    กำลังค้นหาตำแหน่งปัจจุบัน...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Pin on map button - positioned at top right */}
        {!isLoadingLocation && (
          <div className="z-1000 absolute right-3 top-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const newPinMode = !isPinMode;
                      setIsPinMode(newPinMode);

                      if (mapInstanceRef.current) {
                        const container = mapInstanceRef.current.getContainer();
                        container.style.cursor = newPinMode
                          ? "crosshair"
                          : "grab";
                      }
                    }}
                    variant={isPinMode ? "default" : "secondary"}
                    size="sm"
                    className={`rounded-xl transition-all duration-200 ${
                      isPinMode
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isPinMode ? "Pin Mode ON" : "Pin on map"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isPinMode
                      ? "โหมดวางหมุดเปิดอยู่ - คลิกที่แผนที่เพื่อวางหมุด"
                      : "เปิดโหมดวางหมุด"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Pin mode instruction */}
        {isPinMode && !isLoadingLocation && (
          <div className="z-1000 absolute right-3 top-16 max-w-xs">
            <Alert className="border-green-300 bg-green-50">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="font-medium text-green-800">
                คลิกที่แผนที่เพื่อวางหมุด
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
      {/* Input fields for coordinates */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="latitude" className="text-sm font-medium">
            {t("charging-stations.latitude")}
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={latitude ? latitude.toFixed(4) : ""}
            onChange={(e) => {
              const newLat =
                parseFloat(parseFloat(e.target.value).toFixed(4)) || 0;
              setLatitude(newLat);
              if (longitude) {
                handleCoordinateChange(newLat, longitude);
              }
            }}
            placeholder={t("charging-stations.latitude_placeholder")}
            disabled={isLoadingLocation}
            className="h-10 border-0 bg-[#f2f2f2] sm:h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude" className="text-sm font-medium">
            {t("charging-stations.longitude")}
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={longitude ? longitude.toFixed(4) : ""}
            onChange={(e) => {
              const newLng =
                parseFloat(parseFloat(e.target.value).toFixed(4)) || 0;
              setLongitude(newLng);
              if (latitude) {
                handleCoordinateChange(latitude, newLng);
              }
            }}
            placeholder={t("charging-stations.longitude_placeholder")}
            disabled={isLoadingLocation}
            className="h-10 border-0 bg-[#f2f2f2] sm:h-11"
          />
        </div>
      </div>
    </div>
  );
}
