import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  Lock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { mockRadarAlerts } from '@/data/mockData';
import type { RadarAlert } from '@/types';

export function Radar() {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAlerts = mockRadarAlerts.filter(alert => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'resolved' ? alert.isResolved : !alert.isResolved);
    
    return matchesSeverity && matchesType && matchesStatus;
  });

  const getSeverityIcon = (severity: RadarAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: RadarAlert['type']) => {
    switch (type) {
      case 'fraud':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'security':
        return <Lock className="h-4 w-4 text-orange-600" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'risk':
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const alertCounts = {
    total: mockRadarAlerts.length,
    unresolved: mockRadarAlerts.filter(a => !a.isResolved).length,
    critical: mockRadarAlerts.filter(a => a.severity === 'critical').length,
    resolved: mockRadarAlerts.filter(a => a.isResolved).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Radar</h1>
        <p className="text-gray-600 mt-2">
          Monitor security threats, fraud detection, and compliance alerts.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-amber-600" />
              Total Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{alertCounts.total}</p>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-gradient-to-br from-white to-red-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
              Unresolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{alertCounts.unresolved}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{alertCounts.critical}</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-gradient-to-br from-white to-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{alertCounts.resolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="risk">Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Alert key={alert.id} className={`border-l-4 ${
            alert.severity === 'critical' ? 'border-l-red-500 bg-red-50/50' :
            alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50/50' :
            alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50/50' :
            'border-l-blue-500 bg-blue-50/50'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTitle className="text-gray-900">{alert.title}</AlertTitle>
                    <StatusBadge status={alert.severity} />
                    <Badge variant="outline" className="text-xs">
                      {getTypeIcon(alert.type)}
                      <span className="ml-1 capitalize">{alert.type}</span>
                    </Badge>
                  </div>
                  <AlertDescription className="text-gray-600 mb-2">
                    {alert.description}
                  </AlertDescription>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(alert.timestamp)}
                    </span>
                    {alert.relatedTransaction && (
                      <span className="flex items-center">
                        Related: <code className="ml-1 bg-gray-100 px-1 rounded text-xs">{alert.relatedTransaction}</code>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {alert.isResolved ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolved
                  </Badge>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="border-amber-300 hover:bg-amber-50">
                      <Eye className="h-3 w-3 mr-1" />
                      Investigate
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                      Resolve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Alert>
        ))}

        {filteredAlerts.length === 0 && (
          <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
            <CardContent className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No alerts found matching your filters.</p>
              <p className="text-sm mt-1">Your system is secure and running smoothly.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}