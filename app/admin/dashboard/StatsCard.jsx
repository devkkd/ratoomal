import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Revenue',
    value: '$54,231',
    change: '+12.5%',
    changeType: 'increase',
    icon: CurrencyDollarIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Total Orders',
    value: '1,245',
    change: '+5.2%',
    changeType: 'increase',
    icon: ShoppingCartIcon,
    color: 'bg-[#C08237]',
  },
  {
    name: 'Active Customers',
    value: '8,542',
    change: '-2.1%',
    changeType: 'decrease',
    icon: UserGroupIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Conversion Rate',
    value: '3.24%',
    change: '+0.8%',
    changeType: 'increase',
    icon: ChartBarIcon,
    color: 'bg-orange-500',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <div
                  className={`ml-2 flex items-center text-sm font-medium ${
                    stat.changeType === 'increase'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}