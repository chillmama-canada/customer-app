import { StyleSheet, View } from 'react-native';
import { HelperCard } from './HelperCard';
import type { HelperRecommendation } from '../services/helpersApi';

interface PreviousHelperCardProps {
  helper: HelperRecommendation;
  onPress: () => void;
}

export function PreviousHelperCard({ helper, onPress }: PreviousHelperCardProps) {
  return (
    <View style={styles.row}>
      <View style={styles.container}>
        <HelperCard helper={helper} onPressPhoto={onPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  container: {
    height: 340,
  },
});
