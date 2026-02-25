import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SystemAnalytics = () => {
    const data = [
        { name: 'Course A', completion: 80 },
        { name: 'Course B', completion: 45 },
        { name: 'Course C', completion: 90 },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#059669] mb-6">System Analytics</h1>
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold mb-4">Course Completion Rate (%)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="completion" fill="#059669" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SystemAnalytics;