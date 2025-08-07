import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  CreditCard, 
  Shield, 
  CheckCircle,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export function CryptoPayUI() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [selectedCrypto, setSelectedCrypto] = useState('ETH');
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);

  const paymentData = {
    name: 'Premium Membership',
    description: 'Access to premium features and exclusive content',
    amount: '29.99',
    currency: 'USD'
  };

  const cryptoOptions = ['ETH', 'BTC', 'USDT', 'USDC'];
  
  const getCryptoAmount = (cryptoType: string) => {
    const rates = {
      'ETH': '0.0012',
      'BTC': '0.000045',
      'USDT': '29.99',
      'USDC': '29.99'
    };
    return rates[cryptoType as keyof typeof rates] || '0.0012';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    setPaymentStatus('processing');
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('completed');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CryptoPay</h1>
            </div>
            <Button
              onClick={handleConnectWallet}
              disabled={isWalletConnected}
              className={`${
                isWalletConnected 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
              }`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Terminal Preview */}
          <div className="space-y-6">
            <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-600">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Terminal Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-amber-200">
                  <div className="text-center space-y-6">
                    {/* Payment Status */}
                    <div className="flex items-center justify-center">
                      {paymentStatus === 'pending' && (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      {paymentStatus === 'processing' && (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {paymentStatus === 'completed' && (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                    </div>

                    {/* Payment Details */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {paymentData.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {paymentData.description}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-gray-900">
                        ${paymentData.amount}
                      </div>
                      <div className="text-sm text-gray-500">
                        ≈ {getCryptoAmount(selectedCrypto)} {selectedCrypto}
                      </div>
                    </div>

                    {/* Payment Button */}
                    <Button
                      onClick={handleConnectWallet}
                      disabled={isWalletConnected}
                      className={`w-full ${
                        isWalletConnected 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
                      }`}
                    >
                      {paymentStatus === 'pending' && (
                        <>
                          <Wallet className="h-4 w-4 mr-2" />
                          Pay with Crypto
                        </>
                      )}
                      {paymentStatus === 'processing' && (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing Payment...
                        </>
                      )}
                      {paymentStatus === 'completed' && (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Payment Complete
                        </>
                      )}
                    </Button>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <Shield className="h-3 w-3" />
                      <span>Secure crypto payment powered by CryptoPay</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <div className="space-y-6">
            <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader>
                <CardTitle className="text-amber-600">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Product</span>
                    <span className="font-medium">{paymentData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">${paymentData.amount} USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Crypto Type</span>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white border border-gray-200 hover:bg-gray-50 min-w-[100px]"
                        onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                      >
                        {selectedCrypto}
                        <ChevronDown className="h-3 w-3 ml-2" />
                      </Button>
                      {showCryptoDropdown && (
                        <div className="absolute right-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          {cryptoOptions.map((crypto) => (
                            <button
                              key={crypto}
                              className="w-full px-3 py-2 text-left text-sm bg-white hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                              onClick={() => {
                                setSelectedCrypto(crypto);
                                setShowCryptoDropdown(false);
                              }}
                            >
                              {crypto}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Crypto Amount</span>
                    <span className="font-medium">{getCryptoAmount(selectedCrypto)} {selectedCrypto}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Network Fee (Scroll)</span>
                    <span className="font-medium">Free! Subsidy by CryptoPay</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">Total</span>
                      <span className="text-gray-900 font-semibold">${paymentData.amount} USD</span>
                    </div>
                  </div>
                </div>


              </CardContent>
            </Card>

            {/* Status */}
            <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader>
                <CardTitle className="text-amber-600">Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      paymentStatus === 'pending' ? 'bg-gray-300' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm">Wallet Connection</span>
                    {isWalletConnected && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      paymentStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Payment Processing</span>
                    {paymentStatus === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      paymentStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Transaction Complete</span>
                    {paymentStatus === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
