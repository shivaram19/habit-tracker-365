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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search highlights..."
          value={filters.searchQuery}
          onChangeText={(text) =>
            onFiltersChange({ ...filters, searchQuery: text })
          }
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <TouchableOpacity
        style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
        onPress={handleOpenModal}
      >
        <Filter size={20} color={hasActiveFilters ? '#FFFFFF' : '#6B7280'} />
      </TouchableOpacity>

      {hasActiveFilters && (
        <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
          <X size={20} color="#DC2626" />
        </TouchableOpacity>
      )}

      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter History</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    tempFilters.categoryFilter === null &&
                      styles.categoryChipActive,
                  ]}
                  onPress={() =>
                    setTempFilters({ ...tempFilters, categoryFilter: null })
                  }
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      tempFilters.categoryFilter === null &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {CATEGORIES.map((cat) => {
                  const isSelected = tempFilters.categoryFilter === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        isSelected && {
                          backgroundColor: cat.color,
                          borderColor: cat.color,
                        },
                      ]}
                      onPress={() =>
                        setTempFilters({ ...tempFilters, categoryFilter: cat.id })
                      }
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Spending Range</Text>
              <View style={styles.rangeInputs}>
                <View style={styles.rangeInput}>
                  <Text style={styles.rangeLabel}>Min ($)</Text>
                  <TextInput
                    style={styles.input}
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
                <View style={styles.rangeInput}>
                  <Text style={styles.rangeLabel}>Max ($)</Text>
                  <TextInput
                    style={styles.input}
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

          <View style={styles.modalFooter}>
            <Button
              title="Clear All"
              onPress={handleClearAll}
              variant="secondary"
              style={styles.footerButton}
            />
            <Button
              title="Apply"
              onPress={handleApplyFilters}
              style={styles.footerButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  clearButton: {
    padding: 10,
  },
  modalContent: {
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rangeInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  footerButton: {
    flex: 1,
  },
});
