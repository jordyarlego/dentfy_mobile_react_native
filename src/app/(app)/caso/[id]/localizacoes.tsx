import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Body } from '@/components/Typography';
import HeaderPerito from '@/components/header';
import { colors } from '@/theme/colors';
import type { Location as CustomLocation, LocationType } from '@/types/caso';
import api from '@/services/api';

export default function Localizacoes() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<CustomLocation[]>([]);
  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (id) {
      carregarLocalizacoes();
    }
  }, [id]);

  const carregarLocalizacoes = async () => {
    try {
      setLoading(true);
      const novasLocations: CustomLocation[] = [];

      // Caso
      const casoRes = await api.get(`/api/cases/${id}`);
      const caso = casoRes.data.caso;

      const casoLat = Number(caso.latitude);
      const casoLng = Number(caso.longitude);

      if (!isNaN(casoLat) && !isNaN(casoLng) && caso.local) {
        novasLocations.push({
          id: `caso_${caso._id}`,
          title: `Caso: ${caso.titulo}`,
          description: caso.local,
          latitude: casoLat,
          longitude: casoLng,
          type: 'caso',
        });
      }
      // Periciados
      const periciadosRes = await api.get(`/api/periciados/por-caso/${id}`);
      const periciados = periciadosRes.data;

      if (Array.isArray(periciados)) {
        periciados.forEach((p) => {
          const lat = Number(p.latitude);
          const lng = Number(p.longitude);

          if (!isNaN(lat) && !isNaN(lng) && p.endereco) {
            novasLocations.push({
              id: `periciado_${p._id}`,
              title: `Periciado: ${p.nomeCompleto || p.nome}`,
              description: p.endereco,
              latitude: lat,
              longitude: lng,
              type: 'periciado',
            });
          }
        });
      }

      // Evidências
      const evidenciasRes = await api.get(`/api/evidences/${id}`);
      const evidencias = evidenciasRes.data;

      if (Array.isArray(evidencias)) {
        evidencias.forEach((e) => {
          const lat = Number(e.latitude);
          const lng = Number(e.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            novasLocations.push({
              id: `evidencia_${e._id}`,
              title: `Evidência: ${e.tipo}`,
              description: e.descricao || '',
              latitude: lat,
              longitude: lng,
              type: 'evidencia',
            });
          }
        });
      }

      setLocations(novasLocations);

      if (novasLocations.length > 0) {
        const first = novasLocations[0];
        setRegion({
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        await usarLocalizacaoDoDispositivo();
      }
    } catch (error) {
      console.error('Erro ao carregar localizações:', error);
      setLocations([]);
      await usarLocalizacaoDoDispositivo();
    } finally {
      setLoading(false);
    }
  };

  const usarLocalizacaoDoDispositivo = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissão de localização negada');
        return;
      }

      const local = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: local.coords.latitude,
        longitude: local.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (e) {
      console.warn('Não foi possível obter localização do dispositivo:', e);
    }
  };

  const getMarkerIcon = (type: LocationType): { name: string; color: string } => {
    switch (type) {
      case 'caso':
        return { name: 'document-text', color: colors.dentfyAmber };
      case 'periciado':
        return { name: 'person', color: colors.dentfyAmber };
      case 'evidencia':
        return { name: 'search', color: colors.dentfyAmber };
      default:
        console.warn('Tipo de marcador desconhecido:', type);
        return { name: 'location', color: colors.dentfyAmber };
    }
  };

  return (
    <View className="flex-1 bg-dentfyGray900">
      <HeaderPerito showBackButton title="Localizações" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.dentfyAmber} />
          <Body className="text-dentfyTextPrimary mt-4">
            Carregando localizações...
          </Body>
        </View>
      ) : locations.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Body className="text-dentfyTextPrimary text-center">
            Nenhuma localização encontrada para este caso.
          </Body>
        </View>
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {locations.map((loc) => {
            const markerIcon = getMarkerIcon(loc.type);
            return (
              <Marker
                key={loc.id}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                title={loc.title}
                description={loc.description}
                onCalloutPress={() => {
                  if (loc.type === 'evidencia') {
                    const evidenciaId = loc.id.replace('evidencia_', '');
                    router.push(`/evidencia/${evidenciaId}`);
                  }
                }}
              >
                <View
                  style={{
                    backgroundColor: markerIcon.color,
                    borderRadius: 20,
                    padding: 8,
                    borderWidth: 2,
                    borderColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Ionicons 
                    name={markerIcon.name as any} 
                    size={20} 
                    color="white" 
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
      )}
    </View>
  );
} 