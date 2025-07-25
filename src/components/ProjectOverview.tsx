import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Task, Manpower } from "../types";

interface ProjectMetrics {
  total: number;
  completed: number;
  stuck: number;
  remaining: number;
}

interface ProjectOverviewProps {
  tasks: Task[];
  manpower?: Manpower[];
}

export default function ProjectOverview({ tasks, manpower = [] }: ProjectOverviewProps) {
  // Calculate project summary from main tasks only (no subtasks)
  const calculateProjectSummary = () => {
    const mainTasks = tasks.filter(task => !task.parent_task_id);
    
    if (mainTasks.length === 0) {
      return { totalDuration: 0, totalCost: 0 };
    }

    // Find earliest start date and latest end date
    const startDates = mainTasks.map(task => new Date(task.start_time));
    const endDates = mainTasks.map(task => new Date(task.due_time));
    
    const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())));
    const latestEnd = new Date(Math.max(...endDates.map(d => d.getTime())));
    
    // Calculate total duration in days
    const totalDuration = Math.ceil((latestEnd.getTime() - earliestStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate total cost
    const totalCost = mainTasks.reduce((sum, task) => sum + (task.est_cost || 0), 0);
    
    return { totalDuration, totalCost };
  };

  const { totalDuration, totalCost } = calculateProjectSummary();

  const calculateProjectMetrics = (): ProjectMetrics => {
    const total = tasks.reduce((sum, task) => sum + task.total_job, 0);
    const completed = tasks.reduce((sum, task) => sum + task.completed, 0);
    const stuck = tasks.reduce((sum, task) => sum + task.stuck, 0);
    const remaining = total - completed - stuck;

    return { total, completed, stuck, remaining };
  };

  const metrics = calculateProjectMetrics();

  const chartData = [
    { name: "Completed", value: metrics.completed, color: "#10B981" },
    { name: "Stuck", value: metrics.stuck, color: "#EF4444" },
    { name: "Remaining", value: metrics.remaining, color: "#3B82F6" },
  ];

  // Calculate manpower summary
  const calculateManpowerSummary = () => {
    if (manpower.length === 0) {
      return {
        totalRecords: 0,
        totalCost: 0,
        totalManpower: 0,
        byType: {},
        byWork: {},
        byDate: {}
      };
    }

    const byType: { [key: string]: number } = {};
    const byWork: { [key: string]: number } = {};
    const byDate: { [key: string]: { [key: string]: number } } = {};
    let totalCost = 0;
    let totalManpower = 0;

    manpower.forEach(record => {
      const dateKey = record.date.split('T')[0];
      const manpowerCount = record.number_of_manpower || 1;
      
      // Count by manpower type
      byType[record.manpower_type] = (byType[record.manpower_type] || 0) + manpowerCount;
      
      // Count by work type
      byWork[record.engaged_to] = (byWork[record.engaged_to] || 0) + manpowerCount;
      
      // Count by date
      if (!byDate[dateKey]) {
        byDate[dateKey] = {};
      }
      byDate[dateKey][record.manpower_type] = (byDate[dateKey][record.manpower_type] || 0) + manpowerCount;
      
      // Sum total cost
      if (record.perday_cost) {
        totalCost += record.perday_cost * manpowerCount;
      }
      
      // Sum total manpower
      totalManpower += manpowerCount;
    });

    return {
      totalRecords: manpower.length,
      totalCost,
      totalManpower,
      byType,
      byWork,
      byDate
    };
  };

  const manpowerSummary = calculateManpowerSummary();

  // Prepare chart data for manpower by type
  const manpowerByTypeData = Object.entries(manpowerSummary.byType).map(([type, count]) => ({
    type,
    count
  }));

  // Prepare chart data for manpower by work
  const manpowerByWorkData = Object.entries(manpowerSummary.byWork).map(([work, count]) => ({
    work,
    count
  }));

  // Prepare chart data for day-wise manpower engagement
  const manpowerByDateData = Object.entries(manpowerSummary.byDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, typeData]) => {
      // Parse date string (YYYY-MM-DD) and format as DD/MM/YYYY
      const [year, month, day] = date.split('-');
      return {
        date: `${day}/${month}/${year}`,
        ...typeData
      };
    });

  return (
    <div className="space-y-6">
      {/* Project Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Project Duration</p>
                <p className="text-2xl font-bold text-blue-600">{totalDuration} days</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Project Cost</p>
                <p className="text-2xl font-bold text-green-600">${totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Progress Overview */}
       <div className="bg-white p-6 rounded-lg shadow-sm border">
         <h3 className="text-lg font-semibold text-gray-800 mb-6">Progress Overview</h3>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
           {/* Progress Chart - Left Side */}
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={80}
                   outerRadius={140}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip 
                   formatter={(value: number) => [value, 'Units']}
                   labelFormatter={(label) => `${label} Tasks`}
                 />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>

           {/* Metrics Cards - Right Side */}
           <div className="space-y-4">
             <div className="bg-blue-50 p-4 rounded-lg">
               <div className="flex items-center">
                 <div className="p-2 bg-blue-100 rounded-lg mr-3">
                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                   </svg>
                 </div>
                 <div>
                   <p className="text-sm text-gray-600">Total Job</p>
                   <p className="text-xl font-bold text-blue-600">{metrics.total}</p>
                 </div>
               </div>
             </div>
             
             <div className="bg-green-50 p-4 rounded-lg">
               <div className="flex items-center">
                 <div className="p-2 bg-green-100 rounded-lg mr-3">
                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <div>
                   <p className="text-sm text-gray-600">Completed</p>
                   <p className="text-xl font-bold text-green-600">{metrics.completed}</p>
                 </div>
               </div>
             </div>
             
             <div className="bg-red-50 p-4 rounded-lg">
               <div className="flex items-center">
                 <div className="p-2 bg-red-100 rounded-lg mr-3">
                   <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                   </svg>
                 </div>
                 <div>
                   <p className="text-sm text-gray-600">Stuck</p>
                   <p className="text-xl font-bold text-red-600">{metrics.stuck}</p>
                 </div>
               </div>
             </div>
             
             <div className="bg-yellow-50 p-4 rounded-lg">
               <div className="flex items-center">
                 <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                   <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
                 <div>
                   <p className="text-sm text-gray-600">Remaining</p>
                   <p className="text-xl font-bold text-yellow-600">{metrics.remaining}</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Manpower Summary */}
       {manpower.length > 0 && (
         <div className="bg-white p-6 rounded-lg shadow-sm border">
           <h3 className="text-lg font-semibold text-gray-800 mb-6">Manpower Summary</h3>
           
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
             {/* Manpower Overview Cards */}
             <div className="space-y-4">
               <div className="bg-purple-50 p-4 rounded-lg">
                 <div className="flex items-center">
                   <div className="p-2 bg-purple-100 rounded-lg mr-3">
                     <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                   </div>
                   <div>
                     <p className="text-sm text-gray-600">Total Records</p>
                     <p className="text-xl font-bold text-purple-600">{manpowerSummary.totalRecords}</p>
                   </div>
                 </div>
               </div>
               
               <div className="bg-blue-50 p-4 rounded-lg">
                 <div className="flex items-center">
                   <div className="p-2 bg-blue-100 rounded-lg mr-3">
                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                   </div>
                   <div>
                     <p className="text-sm text-gray-600">Total Manpower</p>
                     <p className="text-xl font-bold text-blue-600">{manpowerSummary.totalManpower}</p>
                   </div>
                 </div>
               </div>
               
               <div className="bg-orange-50 p-4 rounded-lg">
                 <div className="flex items-center">
                   <div className="p-2 bg-orange-100 rounded-lg mr-3">
                     <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                     </svg>
                   </div>
                   <div>
                     <p className="text-sm text-gray-600">Total Cost</p>
                     <p className="text-xl font-bold text-orange-600">${manpowerSummary.totalCost.toLocaleString()}</p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Manpower by Type Chart */}
             <div className="h-64">
               <h4 className="text-md font-semibold text-gray-700 mb-3">By Manpower Type</h4>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={manpowerByTypeData}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="type" />
                   <YAxis />
                   <Tooltip />
                   <Bar dataKey="count" fill="#8B5CF6" />
                 </BarChart>
               </ResponsiveContainer>
             </div>

             {/* Manpower by Work Type Chart */}
             <div className="h-64">
               <h4 className="text-md font-semibold text-gray-700 mb-3">By Work Type</h4>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={manpowerByWorkData}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="work" />
                   <YAxis />
                   <Tooltip />
                   <Bar dataKey="count" fill="#F59E0B" />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           {/* Day-wise Manpower Engagement Chart */}
           <div className="mt-8">
             <h4 className="text-lg font-semibold text-gray-700 mb-4">Day-wise Manpower Engagement</h4>
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={manpowerByDateData}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="date" />
                   <YAxis />
                   <Tooltip />
                   <Legend />
                   <Bar dataKey="Admin" fill="#8B5CF6" stackId="a" />
                   <Bar dataKey="Engineer" fill="#3B82F6" stackId="a" />
                   <Bar dataKey="Supervisor" fill="#10B981" stackId="a" />
                   <Bar dataKey="Labour" fill="#F59E0B" stackId="a" />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
         </div>
       )}
    </div>
  );
} 