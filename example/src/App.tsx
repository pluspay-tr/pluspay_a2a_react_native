import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  PPA2AClient,
  PPA2AException,
  PPEodType,
  PPParameterTypes,
  PPPaymentMethod,
  PPPaymentType,
  PPProductTypeEnum,
  PPQtyEnums,
  PPStartPaymentRequestModel,
  PPCancelPaymentRequestModel,
  PPEftPaymentRequestModel,
  PPEftCancelRequestModel,
  PPOrderPaymentRequestModel,
  PPEodRequestModel,
  PPParameterRequestModel,
  PPMultiPaymentRequest,
} from 'pluspay_a2a_react_native';

/** Minimal RFC4122 v4 UUID (example only). */
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const generateOrderCode = () => new Date().toISOString();

export default function App() {
  const clientRef = useRef<PPA2AClient | null>(null);
  const [log, setLog] = useState<string>('Hazır.');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const client = new PPA2AClient();
    clientRef.current = client;
    client
      .initialize()
      .then(() => {
        setReady(true);
        setLog(`initialize OK\npackage: ${client.packageName}`);
      })
      .catch((e) => setLog(`initialize FAIL: ${String(e)}`));
    return () => {
      client.dispose().catch(() => {});
    };
  }, []);

  async function run(label: string, fn: () => Promise<any>) {
    setLog(`${label}: gönderiliyor...`);
    try {
      const res = await fn();
      setLog(`${label} OK:\n${JSON.stringify(res, null, 2)}`);
    } catch (e) {
      if (e instanceof PPA2AException) {
        setLog(`${label} HATA [${e.errorCode}]: ${e.message}`);
      } else {
        setLog(`${label} HATA: ${String(e)}`);
      }
    }
  }

  const c = () => clientRef.current!;

  // --- Actions ---

  const startPayment = () =>
    run('startPayment', () =>
      c().startPayment(
        PPStartPaymentRequestModel.toRequest({
          orderCode: '86206823',
          totalAmount: 11.9,
          paymentType: PPPaymentType.MULTINET,
          paymentMethod: PPPaymentMethod.NFC,
        })
      )
    );

  const cancelPayment = () =>
    run('cancelPayment', () =>
      c().cancelPayment(
        PPCancelPaymentRequestModel.toRequest({
          orderCode: 'ORD001',
          transactionId: 'TX001',
          note: 'Test iptali',
        })
      )
    );

  const startEftPayment = () =>
    run('startEftPayment', () =>
      c().startEftPayment(
        PPEftPaymentRequestModel.toRequest({
          totalAmount: 3.0,
          paymentType: PPPaymentType.POS,
          paymentMethod: PPPaymentMethod.CC,
          transactionId: uuidv4(),
          taxRate: 0,
        })
      )
    );

  const cancelEftPayment = () =>
    run('cancelEftPayment', () =>
      c().cancelEftPayment(
        PPEftCancelRequestModel.toRequest({
          transactionId: uuidv4(),
          totalAmount: 3.0,
        })
      )
    );

  const startOrderPayment = () =>
    run('startOrderPayment', () =>
      c().startOrderPayment(
        PPOrderPaymentRequestModel.toRequest({ orderCode: 'ORD001' })
      )
    );

  const startMultiPayment = () =>
    run('startMultiPayment', () =>
      c().startMultiPayment(
        PPMultiPaymentRequest.toRequest({
          changePaymentStatus: true,
          orderCode: generateOrderCode(),
          orderDate: new Date(),
          products: [
            {
              id: 1,
              sku: 'SKU001',
              unit: PPQtyEnums.ADET,
              price: 100.0,
              title: 'Test Urun 1',
              quantity: 1,
              taxRate: 20,
              vatInclude: true,
              productType: PPProductTypeEnum.PHYSICALLY,
              discountValue: 0,
            },
          ],
          transactions: [
            {
              paymentType: PPPaymentType.BANK_TRANSFER,
              totalAmount: 50.0,
              paymentMethod: PPPaymentMethod.NONE,
            },
            {
              paymentType: PPPaymentType.BANK_TRANSFER,
              totalAmount: 50.0,
              paymentMethod: PPPaymentMethod.NONE,
            },
          ],
        })
      )
    );

  const triggerEod = () =>
    run('triggerEod', () =>
      c().triggerEod(
        PPEodRequestModel.toRequest({
          isAll: false,
          types: [PPEodType.POS, PPEodType.MULTINET],
        })
      )
    );

  const triggerParameters = () =>
    run('triggerParameters', () =>
      c().triggerParameters(
        PPParameterRequestModel.toRequest({
          isAll: true,
          types: [PPParameterTypes.bank, PPParameterTypes.multinet],
        })
      )
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pluspay A2A Example</Text>

      <ScrollView style={styles.buttons} contentContainerStyle={styles.btnPad}>
        <Section title="Ödeme" />
        <Btn title="Ödeme Başlat" disabled={!ready} onPress={startPayment} />
        <Btn
          title="Ödeme İptal"
          color="#c62828"
          disabled={!ready}
          onPress={cancelPayment}
        />

        <Section title="EFT POS" />
        <Btn title="EFT Ödeme" disabled={!ready} onPress={startEftPayment} />
        <Btn
          title="EFT İptal"
          color="#c62828"
          disabled={!ready}
          onPress={cancelEftPayment}
        />

        <Section title="Sipariş" />
        <Btn
          title="Sipariş Ödeme"
          disabled={!ready}
          onPress={startOrderPayment}
        />

        <Section title="Çoklu Ödeme" />
        <Btn title="Çoklu Ödeme" disabled={!ready} onPress={startMultiPayment} />

        <Section title="Diğer" />
        <Btn title="Gün Sonu" disabled={!ready} onPress={triggerEod} />
        <Btn
          title="Parametre Yükle"
          disabled={!ready}
          onPress={triggerParameters}
        />
      </ScrollView>

      <ScrollView style={styles.logBox}>
        <Text style={styles.logText}>{log}</Text>
      </ScrollView>
    </View>
  );
}

function Section({ title }: { title: string }) {
  return <Text style={styles.section}>{title}</Text>;
}

function Btn({
  title,
  onPress,
  disabled,
  color,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        color ? { backgroundColor: color } : null,
        disabled && styles.btnDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48, paddingHorizontal: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  buttons: { maxHeight: '55%' },
  btnPad: { paddingBottom: 8 },
  section: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    marginTop: 14,
    marginBottom: 6,
  },
  btn: {
    backgroundColor: '#1565c0',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '600' },
  logBox: {
    flex: 1,
    backgroundColor: '#11151c',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  logText: { color: '#7CFC9A', fontFamily: 'monospace', fontSize: 12 },
});
