import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { CATEGORIES } from '@/utils/categories';
import { Filter, X, Search } from 'lucide-react-native';

export interface FilterOptions {
  searchQuery: string;
  categoryFilter: number | null;
  minSpend: number | null;
  maxSpend: number | null;
}

interface HistoryFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export const HistoryFilter: React.FC<HistoryFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const hasActiveFilters =
    filters.searchQuery ||
    filters.categoryFilter !== null ||
    filters.minSpend !== null ||
    filters.maxSpend !== null;

  const handleOpenModal = () => {
    setTempFilters(filters);
    setShowModal(true);
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setShowModal(false);
  };

  const handleClearAll = () => {
    setTempFilters({
      searchQuery: '',
      categoryFilter: null,
      minSpend: null,
      maxSpend: null,
    });
  };

  return (
    <View className="flex-row items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
      <View className="flex-1 flex-row items-center gap-2 bg-gray-100 px-3 py-2.5 rounded-lg">
        <Search size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder="Search highlights..."
          value={filters.searchQuery}
          onChangeText={(text) =>
            onFiltersChange({ ...filters, searchQuery: text })
          }
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <TouchableOpacity
        className={`p-2.5 rounded-lg ${
          hasActiveFilters ? 'bg-blue-500' : 'bg-gray-100'
        }`}
        onPress={handleOpenModal}
      >
        <Filter size={20} color={hasActiveFilters ? '#FFFFFF' : '#6B7280'} />
      </TouchableOpacity>

      {hasActiveFilters && (
        <TouchableOpacity className="p-2.5" onPress={onClearFilters}>
          <X size={20} color="#DC2626" />
        </TouchableOpacity>
      )}

      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <View className="max-h-[80%] p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">Filter History</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[400px]">
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-700 mb-3">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  className={`px-4 py-2.5 rounded-lg border ${
                    tempFilters.categoryFilter === null
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                  onPress={() =>
                    setTempFilters({ ...tempFilters, categoryFilter: null })
                  }
                >
                  <Text
                    className={`text-sm font-medium ${
                      tempFilters.categoryFilter === null
                        ? 'text-white'
                        : 'text-gray-600'
                    }`}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {CATEGORIES.map((cat) => {
                  const isSelected = tempFilters.categoryFilter === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      className="px-4 py-2.5 rounded-lg border"
                      style={{
                        backgroundColor: isSelected ? cat.color : '#FFFFFF',
                        borderColor: isSelected ? cat.color : '#D1D5DB',
                      }}
                      onPress={() =>
                        setTempFilters({ ...tempFilters, categoryFilter: cat.id })
                      }
                    >
                      <Text
                        className={`text-sm ${
                          isSelected ? 'text-white font-semibold' : 'text-gray-600 font-medium'
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-700 mb-3">Spending Range</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-600 mb-1.5">Min ($)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-gray-900"
                    placeholder="0"
                    value={tempFilters.minSpend?.toString() || ''}
                    onChangeText={(text) =>
                      setTempFilters({
                        ...tempFilters,
                        minSpend: text ? parseFloat(text) : null,
                      })
                    }
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-600 mb-1.5">Max ($)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-gray-900"
                    placeholder="1000"
                    value={tempFilters.maxSpend?.toString() || ''}
                    onChangeText={(text) =>
                      setTempFilters({
                        ...tempFilters,
                        maxSpend: text ? parseFloat(text) : null,
                      })
                    }
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="flex-row gap-3 mt-6">
            <View className="flex-1">
              <Button
                title="Clear All"
                onPress={handleClearAll}
                variant="secondary"
              />
            </View>
            <View className="flex-1">
              <Button
                title="Apply"
                onPress={handleApplyFilters}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
