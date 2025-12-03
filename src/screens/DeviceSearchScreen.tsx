import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThietBiService} from '../services';
import {IThietBi} from '../types';
import {useNavigation} from '@react-navigation/native';

const DeviceSearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [devices, setDevices] = useState<IThietBi[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const PAGE_SIZE = 20;
  const DEBOUNCE_TIME = 500; // 500ms debounce

  useEffect(() => {
    // Debounce search: wait for user to stop typing
    const delayTimer = setTimeout(() => {
      if (searchKeyword.trim()) {
        handleSearch();
      } else {
        setDevices([]);
        setPage(0);
        setHasMore(true);
      }
    }, DEBOUNCE_TIME);

    // Cleanup: cancel previous timer if user keeps typing
    return () => clearTimeout(delayTimer);
  }, [searchKeyword]);

  const handleSearch = async (loadMore = false) => {
    if (loading || loadingMore) return;

    const currentPage = loadMore ? page : 0;

    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setDevices([]);
    }

    try {
      const response = await ThietBiService.search(
        searchKeyword.trim(),
        currentPage,
        PAGE_SIZE,
      );

      const newDevices = response.content || [];

      if (loadMore) {
        setDevices(prev => [...prev, ...newDevices]);
      } else {
        setDevices(newDevices);
      }

      setPage(currentPage);
      setTotalElements(response.totalElements || 0);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Search error:', error);
      // Alert.alert('Lỗi', 'Không thể tìm kiếm thiết bị. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && searchKeyword.trim()) {
      handleSearch(true);
    }
  };

  const handleDevicePress = (device: IThietBi) => {
    // Navigate back to MainTabs with device params
    navigation.navigate('MainTabs', {
      screen: 'DeviceTab',
      params: {device: device},
    });
  };

  const renderDevice = ({item}: {item: IThietBi}) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => handleDevicePress(item)}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.tenThietBi}</Text>
        {item.code && <Text style={styles.deviceCode}>Mã: {item.code}</Text>}
        {item.maNhaMay && (
          <Text style={styles.deviceFactory}>Nhà máy: {item.maNhaMay}</Text>
        )}
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    if (!searchKeyword.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="magnify" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            Nhập tên thiết bị để tìm kiếm
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Không tìm thấy thiết bị nào</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm thiết bị..."
            placeholderTextColor="#999"
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            autoFocus
            returnKeyType="search"
          />
          {searchKeyword.length > 0 && (
            <TouchableOpacity onPress={() => setSearchKeyword('')}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {totalElements > 0 && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultText}>
            Tìm thấy {totalElements} thiết bị
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={(item, index) =>
            item.maThietBi || `device-${index}`
          }
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  resultInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    flexGrow: 1,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  deviceCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  deviceFactory: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default DeviceSearchScreen;
