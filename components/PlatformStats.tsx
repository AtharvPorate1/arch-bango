import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, BarChart2, Bitcoin, Activity, ExternalLink } from 'lucide-react';

const PlatformStats = ({ widthPercentage = 90 }) => {
    const [stats, setStats] = useState({
        tradeCount: 130436,
        userCount: 12020,
        eventCount: 21,
        totalAmountTraded: 481352,
        totalValueLocked: BigInt(1981212215),
        dailyActiveUsers: 845,
        monthlyActiveUsers: 5230
    });

    // Format numbers for better readability (1.2k, 19M, etc.)
    const formatNumber = (num: number) => {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const formatBTC = (sats: number | bigint) => {
        return (Number(sats) / 100000000).toFixed(8) + ' TBTC';
    };



    // Calculate width style based on the provided percentage
    const widthStyle = {
        width: `${widthPercentage}%`
    };

    // Mock data fetching - in a real app, replace with API call
    useEffect(() => {
        const fetchStats = async () => {
            try {

                const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}utils/platform-stats`)
                const data = await apiResponse.json()
                setStats({
                    tradeCount: data.tradeCount,
                    userCount: data.userCount,
                    eventCount: data.eventCount,
                    totalAmountTraded: data.totalAmountTraded,
                    totalValueLocked: BigInt(data.totalValueLocked),
                    dailyActiveUsers: data.dailyActiveUsers,
                    monthlyActiveUsers: data.monthlyActiveUsers
                })

            } catch (error) {
                console.error("Error fetching platform stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="bg-[#0c0c0c] text-white p-6 rounded-lg w-full max-w-full mx-auto">
            <div style={widthStyle} className="mx-auto">
                <h2 className="text-2xl font-bold mb-6">Platform Statistics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Trade Count */}
                    <div className="bg-[#18181B] p-4 rounded-lg w-full">
                        <div className="flex items-center mb-2">
                            <TrendingUp className="mr-2 text-blue-400" size={20} />
                            <h3 className="text-lg font-medium">Total Trades</h3>
                        </div>
                        <p className="text-3xl font-bold">{formatNumber(stats.tradeCount)}</p>
                        <p className="text-gray-400 text-sm mt-1">All time trading activity</p>
                    </div>

                    {/* User Count */}
                    <div className="bg-[#18181B] p-4 rounded-lg w-full">
                        <div className="flex items-center mb-2">
                            <Users className="mr-2 text-green-400" size={20} />
                            <h3 className="text-lg font-medium">Total Users</h3>
                        </div>
                        <p className="text-3xl font-bold">{formatNumber(stats.userCount)}</p>
                        <p className="text-gray-400 text-sm mt-1">Registered accounts</p>
                    </div>

                    {/* Event Count */}
                    <div className="bg-[#18181B] p-4 rounded-lg w-full">
                        <div className="flex items-center mb-2">
                            <Calendar className="mr-2 text-purple-400" size={20} />
                            <h3 className="text-lg font-medium">Total Events</h3>
                        </div>
                        <p className="text-3xl font-bold">{formatNumber(stats.eventCount)}</p>
                        <p className="text-gray-400 text-sm mt-1">Trading events created</p>
                    </div>

                    {/* Total Amount Traded */}
                    <div className="bg-[#18181B] p-4 rounded-lg w-full">
                        <div className="flex items-center mb-2">
                            <BarChart2 className="mr-2 text-yellow-400" size={20} />
                            <h3 className="text-lg font-medium">Amount Traded</h3>
                        </div>
                        <p className="text-3xl font-bold">{formatNumber(stats.totalAmountTraded)}</p>
                        <p className="text-gray-400 text-sm mt-1">Total volume of trades</p>
                    </div>

                    {/* Total Value Locked */}
                    <a
                        href="https://mempool.space/testnet4/address/tb1pd0epx6sjty2xd2ukxmj5j59a3nykuggkkqqsm28x5uweev6s7peqr32gvq"
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full hover:opacity-90 transition-opacity"
                    >
                        <div className="bg-[#18181B] p-4 rounded-lg w-full">
                            <div className="flex items-center mb-2">
                                <Bitcoin className="mr-2 text-orange-400" size={20} />
                                <h3 className="text-lg font-medium">Value Locked</h3>
                                <ExternalLink className="ml-2 w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-3xl font-bold">{formatBTC(stats.totalValueLocked)}</p>
                            <p className="text-gray-400 text-sm mt-1">Total assets in protocol</p>
                        </div>
                    </a>

                    {/* Active Users Stats */}
                    <div className="bg-[#18181B] p-4 rounded-lg w-full">
                        <div className="flex items-center mb-2">
                            <Activity className="mr-2 text-indigo-400" size={20} />
                            <h3 className="text-lg font-medium">Active Users</h3>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xl font-bold">{formatNumber(stats.dailyActiveUsers)}</p>
                                <p className="text-gray-400 text-xs">Daily (DAU)</p>
                            </div>
                            <div className="border-l border-gray-600 pl-4">
                                <p className="text-xl font-bold">{formatNumber(stats.monthlyActiveUsers)}</p>
                                <p className="text-gray-400 text-xs">Monthly (MAU)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformStats;


