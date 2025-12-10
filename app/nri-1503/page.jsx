// app/nri1502/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Globe,
  X,
} from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function NRI1502() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pushingLeadId, setPushingLeadId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({
    key: "submittedAt",
    direction: "desc",
  });

  // Fetch leads from Firestore
  useEffect(() => {
    const q = query(collection(db, "nri-1503"), orderBy("submittedAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsData = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() });
      });
      setLeads(leadsData);
      setFilteredLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = leads;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(term) ||
          lead.phone?.toLowerCase().includes(term) ||
          lead.email?.toLowerCase().includes(term) ||
          lead.id?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    // Apply date filter
    if (selectedDate) {
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      const nextDay = new Date(selected);
      nextDay.setDate(nextDay.getDate() + 1);

      result = result.filter((lead) => {
        const leadDate = lead.submittedAt?.toDate();
        if (!leadDate) return false;
        
        const leadDateOnly = new Date(
          leadDate.getFullYear(),
          leadDate.getMonth(),
          leadDate.getDate()
        );
        
        return leadDateOnly >= selected && leadDateOnly < nextDay;
      });
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      if (sortConfig.key === "submittedAt" || sortConfig.key === "pushedAt") {
        const aDate = aValue.toDate();
        const bDate = bValue.toDate();
        return sortConfig.direction === "asc" 
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredLeads(result);
    setCurrentPage(1);
  }, [leads, searchTerm, statusFilter, selectedDate, sortConfig]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  // Push lead status
  const handlePushLead = async (leadId) => {
    try {
      setPushingLeadId(leadId);
      const leadRef = doc(db, "nri-1503", leadId);
      
      // Check current status
      const leadDoc = await getDoc(leadRef);
      const currentStatus = leadDoc.data()?.status;
      
      // Only update if not already pushed
      if (currentStatus !== "pushed") {
        await updateDoc(leadRef, {
          status: "pushed",
          pushedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error pushing lead:", error);
      alert("Error updating lead status");
    } finally {
      setPushingLeadId(null);
    }
  };

  // Download to Excel
  const handleDownloadExcel = () => {
    const worksheetData = filteredLeads.map((lead) => ({
      ID: lead.id,
      Name: lead.name || "",
      Phone: lead.phone || "",
      Email: lead.email || "",
      Age: lead.age || "",
      "Year of Birth": lead.year_of_birth || "",
      Income: lead.income || "",
      "Country Code": lead.countryCode || "",
      Status: lead.status || "new",
      "Submitted At": lead.submittedAt ? lead.submittedAt.toDate().toLocaleString() : "",
      "Pushed At": lead.pushedAt ? lead.pushedAt.toDate().toLocaleString() : "",
      "IP Address": lead.ipAddress || "",
      Language: lead.language || "",
      Notes: lead.notes || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    // Auto-size columns
    const maxWidth = worksheetData.reduce((w, r) => Math.max(w, r.Name.length), 10);
    worksheet["!cols"] = [{ wch: maxWidth + 2 }];

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const filename = `NRI-1503-Leads-${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, filename);
  };

  // View lead details
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSelectedDate(null);
    setSortConfig({ key: "submittedAt", direction: "desc" });
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  // Clear date filter
  const handleClearDate = () => {
    setSelectedDate(null);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate calendar days
  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay();
    
    // Previous month's days
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth, -i);
      days.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        isCurrentMonth: false,
        isToday: false,
        isSelected: selectedDate === date.toISOString().split("T")[0],
      });
    }
    
    // Current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentYear, currentMonth, i);
      const todayStr = today.toISOString().split("T")[0];
      const dateStr = date.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        day: i,
        isCurrentMonth: true,
        isToday: todayStr === dateStr,
        isSelected: selectedDate === dateStr,
      });
    }
    
    return days;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pushed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (

    <SidebarProvider>
                              <AppSidebar />
                              <SidebarInset>
                                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                                  <SidebarTrigger className="-ml-1" />
                                  <Separator orientation="vertical" className="mr-2 h-4" />
                                  <Breadcrumb>
                                    <BreadcrumbList>
                                      <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                          Building Your Application
                                        </BreadcrumbLink>
                                      </BreadcrumbItem>
                                      <BreadcrumbSeparator className="hidden md:block" />
                                      <BreadcrumbItem>
                                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                      </BreadcrumbItem>
                                    </BreadcrumbList>
                                  </Breadcrumb>
                                </header>
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NRI 1503 Leads</h1>
              <p className="text-gray-600 mt-2">
                Total: <span className="font-semibold">{filteredLeads.length}</span> leads | 
                Pushed: <span className="font-semibold text-blue-600">
                  {leads.filter((l) => l.status === "pushed").length}
                </span> | 
                New: <span className="font-semibold text-green-600">
                  {leads.filter((l) => !l.status || l.status === "new").length}
                </span>
                {selectedDate && (
                  <span className="ml-4 text-blue-600">
                    | Showing: {formatDate(selectedDate)}
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>
              <button
                onClick={handleDownloadExcel}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                Download Excel
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="pushed">Pushed</option>
               
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Filter
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`w-full px-4 py-2.5 border ${
                    selectedDate ? "border-blue-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className={selectedDate ? "text-blue-600" : "text-gray-500"}>
                      {selectedDate ? formatDate(selectedDate) : "Select a date"}
                    </span>
                  </div>
                  {selectedDate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearDate();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </button>
                
                {/* Calendar Popup */}
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </h3>
                        <button
                          onClick={() => handleDateSelect(new Date().toISOString().split("T")[0])}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Today
                        </button>
                      </div>
                      
                      {/* Week Days */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendar().map((day) => (
                          <button
                            key={day.date}
                            onClick={() => handleDateSelect(day.date)}
                            className={`
                              h-10 rounded-lg text-sm font-medium transition-colors
                              ${!day.isCurrentMonth ? "text-gray-400" : ""}
                              ${day.isToday ? "bg-blue-50 text-blue-600" : ""}
                              ${day.isSelected ? "bg-blue-600 text-white" : ""}
                              ${day.isCurrentMonth && !day.isSelected && !day.isToday ? "hover:bg-gray-100" : ""}
                            `}
                          >
                            {day.day}
                          </button>
                        ))}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                        <button
                          onClick={() => handleClearDate()}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortConfig.key}
                onChange={(e) => handleSort(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="submittedAt">Date (Newest)</option>
                <option value="name">Name</option>
                <option value="age">Age</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortConfig.key === "name" && (
                        <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("phone")}
                  >
                    <div className="flex items-center gap-1">
                      Phone
                      {sortConfig.key === "phone" && (
                        <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("age")}
                  >
                    <div className="flex items-center gap-1">
                      Age
                      {sortConfig.key === "age" && (
                        <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("income")}
                  >
                    <div className="flex items-center gap-1">
                      Income
                      {sortConfig.key === "income" && (
                        <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("submittedAt")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortConfig.key === "submittedAt" && (
                        <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {currentItems.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div> */}
                          <div>
                            <div className="font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">ID: {lead.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* <Phone className="h-4 w-4 text-gray-400" /> */}
                          <div>
                            <div className="font-medium">{lead.phone}</div>
                            <div className="text-sm text-gray-500">{lead.countryCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{lead.age}</div>
                          <div className="text-sm text-gray-500">
                            ({lead.year_of_birth})
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{lead.income}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {lead.submittedAt?.toDate().toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status || "new"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewLead(lead)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePushLead(lead.id)}
                            disabled={lead.status === "pushed" || pushingLeadId === lead.id}
                            className={`p-2 rounded-lg transition-colors ${
                              lead.status === "pushed"
                                ? "bg-green-100 text-green-700 cursor-default"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                            title={lead.status === "pushed" ? "Already Pushed" : "Push Lead"}
                          >
                            {pushingLeadId === lead.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : lead.status === "pushed" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              "Push"
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {currentItems.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-500">
                  {selectedDate 
                    ? `No leads submitted on ${formatDate(selectedDate)}. Try another date or remove the date filter.`
                    : "Try adjusting your search or filter to find what you're looking for."}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredLeads.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredLeads.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <div className="hidden sm:flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Details Modal */}
      {isDialogOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
                  <p className="text-gray-600 mt-1">
                    Submitted on {selectedLead.submittedAt?.toDate().toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="mt-1 text-gray-900">{selectedLead.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="mt-1 text-gray-900">{selectedLead.age} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Year of Birth</label>
                      <p className="mt-1 text-gray-900">{selectedLead.year_of_birth}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="mt-1 text-gray-900 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        {selectedLead.countryCode} {selectedLead.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="mt-1 text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {selectedLead.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Income</label>
                      <p className="mt-1 text-gray-900">{selectedLead.income}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            selectedLead.status
                          )}`}
                        >
                          {selectedLead.status || "new"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Technical Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Language</label>
                      <p className="mt-1 text-gray-900">{selectedLead.language || "English"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">IP Address</label>
                      <p className="mt-1 text-gray-900">{selectedLead.ipAddress || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Device</label>
                      <p className="mt-1 text-gray-900 text-sm truncate">
                        {selectedLead.userAgent?.substring(0, 50)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedLead.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handlePushLead(selectedLead.id);
                    setIsDialogOpen(false);
                  }}
                  disabled={selectedLead.status === "pushed"}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    selectedLead.status === "pushed"
                      ? "bg-green-100 text-green-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {selectedLead.status === "pushed" ? "Already Pushed" : "Push Lead"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close calendar when clicking outside */}
      {showDatePicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDatePicker(false)}
        />
      )}
    </div>
     </SidebarInset>
                        </SidebarProvider>
  );
}