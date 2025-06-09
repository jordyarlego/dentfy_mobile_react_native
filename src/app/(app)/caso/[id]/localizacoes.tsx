import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Body } from '@/components/Typography';
import HeaderPerito from '@/components/header';
import { colors } from '@/theme/colors';
import type { Location, LocationType, Caso } from '@/types/caso';
import { STORAGE_KEYS } from '@/types/caso';

export default function Localizacoes() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [region, setRegion] = useState({
    latitude: -23.550520,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    carregarLocalizacoes();
  }, [id]);

  const carregarLocalizacoes = async () => {
    try {
      setLoading(true);
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      
      if (!casosStr) {
        setLocations([]);
        return;
      }

      const casos = JSON.parse(casosStr);
      const caso = casos.find((c: any) => String(c._id) === String(id));
      
      if (!caso) {
        setLocations([]);
        return;
      }

      const novasLocations: Location[] = [];

      // Adicionar localização do caso
      if (caso.endereco) {
        novasLocations.push({
          id: 'caso',
          title: 'Local do Caso',
          description: caso.endereco,
          latitude: caso.latitude || 0,
          longitude: caso.longitude || 0,
          type: 'caso',
        });
      }

      // Adicionar localizações dos periciados
      if (Array.isArray(caso.periciados)) {
        caso.periciados.forEach((periciado: any) => {
          if (periciado.endereco) {
            novasLocations.push({
              id: `periciado_${periciado._id}`,
              title: `Periciado: ${periciado.nome}`,
              description: periciado.endereco,
              latitude: periciado.latitude || 0,
              longitude: periciado.longitude || 0,
              type: 'periciado',
            });
          }
        });
      }

      // Adicionar localizações das evidências
      if (Array.isArray(caso.evidencias)) {
        caso.evidencias.forEach((evidencia: any) => {
          if (evidencia.latitude && evidencia.longitude) {
            novasLocations.push({
              id: `evidencia_${evidencia._id}`,
              title: `Evidência: ${evidencia.tipo}`,
              description: evidencia.descricao || '',
              latitude: evidencia.latitude,
              longitude: evidencia.longitude,
              type: 'evidencia',
            });
          }
        });
      }

      setLocations(novasLocations);

      // Se houver localizações, centralizar o mapa na primeira
      if (novasLocations.length > 0) {
        setRegion({
          latitude: novasLocations[0].latitude,
          longitude: novasLocations[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar localizações:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (type: LocationType): string => {
    switch (type) {
      case 'caso':
        return colors.dentfyAmber;
      case 'periciado':
        return colors.dentfyRed;
      case 'evidencia':
        return colors.dentfyBlue;
      default:
        return colors.dentfyGray;
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
          {locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.title}
              description={location.description}
              pinColor={getMarkerColor(location.type)}
            />
          ))}
        </MapView>
      )}
    </View>
  );
} 