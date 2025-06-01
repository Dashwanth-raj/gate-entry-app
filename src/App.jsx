import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import toast, { Toaster } from 'react-hot-toast';


// Mock Shadcn UI Components for a self-contained example
// In a real project, you would import them from your components/ui directory.
const Button = ({ children, onClick, className = "", size, variant, disabled, title }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}
      ${variant === "destructive" ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500" :
         variant === "outline" ? "border border-gray-300 text-gray-700 hover:bg-gray-100" :
         "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"}
      ${size === "icon" ? "w-10 h-10 flex items-center justify-center p-0" :
         size === "sm" ? "px-3 py-1.5 text-sm" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    `}
    disabled={disabled}
    title={title}
  >
    {children}
  </button>
);

const Input = ({ type = "text", id, value, onChange, placeholder, className = "", min, readOnly, list }) => (
  <input
    type={type}
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    min={min}
    readOnly={readOnly}
    list={list}
  />
);

const Label = ({ htmlFor, children, className = "" }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

// Mock Dialog components (Modal)
const Dialog = ({ open, onOpenChange, children }) => (
  <div style={{ display: open ? 'block' : 'none' }}>
    {/* Backdrop for the modal - increased z-index */}
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={() => onOpenChange(false)}></div>
    {/* Dialog content - solid background and centered, increased z-index, explicitly setting opacity and mix-blend-mode */}
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-8 z-[9999] sm:max-w-[480px] w-[90vw] max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out opacity-100 mix-blend-normal">
      {children}
    </div>
  </div>
);
const DialogContent = ({ children, className = "" }) => <div className={className}>{children}</div>;
const DialogDescription = ({ children, className = "" }) => <p className={`text-gray-900 mt-2 text-base ${className}`}>{children}</p>;
const DialogFooter = ({ children, className = "" }) => <div className={`mt-8 flex justify-end space-x-3 ${className}`}>{children}</div>;
const DialogHeader = ({ children }) => <div>{children}</div>;
const DialogTitle = ({ children, className = "" }) => <h2 className={`text-2xl font-bold text-gray-800 ${className}`}>{children}</h2>;
const DialogTrigger = ({ children }) => <>{children}</>; // Not used directly in this mock, but kept for structure

// Mock Select components
const Select = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {children}
  </select>
);
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
const SelectTrigger = ({ children, className = "" }) => <div className={`w-full ${className}`}>{children}</div>;
const SelectValue = ({ placeholder }) => <span className="text-gray-500">{placeholder}</span>;

// Mock Table components
const Table = ({ children, className = "" }) => <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>;
const TableBody = ({ children, className = "" }) => <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>;
const TableCell = ({ children, className = "" }) => <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;
const TableHead = ({ children, className = "" }) => <th className={`h-12 px-4 text-left align-middle font-semibold text-gray-600 [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</th>;
const TableHeader = ({ children, className = "" }) => <thead className={`[&_tr]:border-b border-gray-200 ${className}`}>{children}</thead>;
const TableRow = ({ children, className = "" }) => <tr className={`border-b border-gray-200 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100 ${className}`}>{children}</tr>;


// Mock XML Data for pre-configured purposes and authorities
const mockXmlData = `
<CommunityData>
  <Authorities>
    <Authority id="A001">
      <Name>Dr. Alice Johnson</Name>
      <Department>Administration</Department>
      <Role>Director</Role>
      <Phone>+91-1234567890</Phone>
      <Email>alice.j@uni.edu</Email>
    </Authority>
    <Authority id="A002">
      <Name>Mr. Bob Williams</Name>
      <Department>Security</Department>
      <Role>Head of Security</Role>
      <Phone>+91-9876543210</Phone>
      <Email>bob.w@uni.edu</Email>
    </Authority>
    <Authority id="A003">
      <Name>Ms. Carol Davis</Name>
      <Department>Events</Department>
      <Role>Event Manager</Role>
      <Phone>+91-1122334455</Phone>
      <Email>carol.d@uni.edu</Email>
    </Authority>
    <Authority id="A004">
      <Name>General Reception</Name>
      <Department>Front Desk</Department>
      <Role>Receptionist</Role>
      <Phone>+91-5566778899</Phone>
      <Email>reception@uni.edu</Email>
    </Authority>
  </Authorities>
  <ApprovedPurposes>
    <Purpose id="P001" authority_ids="A001">
      <Name>Meeting with Director</Name>
    </Purpose>
    <Purpose id="P002" authority_ids="A002">
      <Name>Maintenance Visit</Name>
    </Purpose>
    <Purpose id="P003" authority_ids="A001,A003">
      <Name>Event Attendee</Name>
    </Purpose>
    <Purpose id="P004" authority_ids="A004">
      <Name>Delivery</Name>
    </Purpose>
    <Purpose id="P005" authority_ids="A004">
      <Name>General Visitor</Name>
    </Purpose>
  </ApprovedPurposes>
  <RegisteredVehicles>
    <Vehicle license_plate="TG01AB1234">
      <OwnerName>John Doe</OwnerName>
      <Purpose>Faculty</Purpose>
    </Vehicle>
    <Vehicle license_plate="DL05CD5678">
      <OwnerName>Jane Smith</OwnerName>
      <Purpose>Student</Purpose>
    </Vehicle>
    <Vehicle license_plate="UP14YZ9012">
      <OwnerName>Ravi Sharma</Name>
      <Purpose>Vendor</Purpose>
    </Vehicle>
  </RegisteredVehicles>
</CommunityData>
`;

// Utility functions to parse XML data
const parseXml = (xmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, "application/xml");
};

const extractXmlData = (xmlDoc) => {
  const authorities = Array.from(xmlDoc.querySelectorAll('Authority')).map(authNode => ({
    id: authNode.getAttribute('id'),
    name: authNode.querySelector('Name')?.textContent,
    department: authNode.querySelector('Department')?.textContent,
    role: authNode.querySelector('Role')?.textContent,
    phone: authNode.querySelector('Phone')?.textContent,
    email: authNode.querySelector('Email')?.textContent,
  }));

  const purposes = Array.from(xmlDoc.querySelectorAll('Purpose')).map(purposeNode => ({
    id: purposeNode.getAttribute('id'),
    name: purposeNode.querySelector('Name')?.textContent,
    authorityIds: purposeNode.getAttribute('authority_ids') ? purposeNode.getAttribute('authority_ids').split(',') : [],
  }));

  const registeredVehicles = Array.from(xmlDoc.querySelectorAll('Vehicle')).map(vehicleNode => ({
    licensePlate: vehicleNode.getAttribute('license_plate'),
    ownerName: vehicleNode.querySelector('OwnerName')?.textContent,
    purpose: vehicleNode.querySelector('Purpose')?.textContent,
  }));

  return { authorities, purposes, registeredVehicles };
};

// Regex for Indian license plates (e.g., TG01AB1234)
const LICENSE_PLATE_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

function App() {
  // State variables for form inputs
  const [licensePlate, setLicensePlate] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [purpose, setPurpose] = useState('');

  // State for lookup results and selected authority
  const [lookupResults, setLookupResults] = useState(null);
  const [selectedAuthorityId, setSelectedAuthorityId] = useState('');

  // State for static XML data (authorities, purposes, registered vehicles)
  const [authoritiesData, setAuthoritiesData] = useState([]);
  const [purposesData, setPurposesData] = useState([]);
  const [registeredVehiclesData, setRegisteredVehiclesData] = useState([]);

  // State for vehicles currently inside (persisted in local storage)
  const [vehiclesInside, setVehiclesInside] = useState(() => {
    try {
      const stored = localStorage.getItem('vehiclesInside');
      return stored ? JSON.parse(stored).map(item => ({
        ...item,
        entryTime: new Date(item.entryTime),
      })) : [];
    } catch (error) {
      console.error("Failed to parse vehiclesInside from localStorage", error);
      return [];
    }
  });

  // State for vehicle history (persisted in local storage)
  const [vehicleHistory, setVehicleHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('vehicleHistory');
      return stored ? JSON.parse(stored).map(item => ({
        ...item,
        entryTime: new Date(item.entryTime),
        exitTime: item.exitTime ? new Date(item.exitTime) : null,
      })) : [];
    } catch (error) {
      console.error("Failed to parse vehicleHistory from localStorage", error);
      return [];
    }
  });

  // State for custom modal (dialog)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', onConfirm: null, onCancel: null, showCancel: false });
  const [isCameraPermissionModalOpen, setIsCameraPermissionModalOpen] = useState(false); // State for camera permission modal

  // Camera related states and refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // State for Gemini API loading indicators
  const [isGeneratingPurpose, setIsGeneratingPurpose] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);


  // Effect to load XML data on component mount
  useEffect(() => {
    const xmlDoc = parseXml(mockXmlData);
    const { authorities, purposes, registeredVehicles } = extractXmlData(xmlDoc);
    setAuthoritiesData(authorities);
    setPurposesData(purposes);
    setRegisteredVehiclesData(registeredVehicles);
  }, []);

  // Effects to persist vehiclesInside and vehicleHistory to local storage
  useEffect(() => {
    localStorage.setItem('vehiclesInside', JSON.stringify(vehiclesInside));
  }, [vehiclesInside]);

  useEffect(() => {
    localStorage.setItem('vehicleHistory', JSON.stringify(vehicleHistory));
  }, [vehicleHistory]);

  // Function to show a custom modal
  const showAppModal = ({ title, description, onConfirm, onCancel = null, showCancel = false }) => {
    setModalContent({ title, description, onConfirm, onCancel, showCancel });
    setIsModalOpen(true);
  };

  // Function to stop the camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Simulate OCR for license plate from camera feed
  const simulateOCR = async (imageData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock license plates for simulation
        const mockPlates = ['TG01AB1234', 'DL05CD5678', 'UP14YZ9012', 'MH02JK0001', 'TN37AB5678', 'INVALIDPLATE12', 'ABCD12345678'];
        const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];

        // Simulate success or failure
        if (Math.random() > 0.15) { // 85% chance of success
          resolve(randomPlate);
        } else {
          reject(new Error("OCR failed or plate not recognized."));
        }
      }, 1500); // Simulate network/processing delay
    });
  };

  // Function to start the camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsCameraActive(true);
        setLicensePlate(''); // Clear previous input on camera start
        toast.success('Camera started. Point at the number plate and tap the camera button to scan.', { duration: 3000 });
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Show the specific camera permission modal on error
      setIsCameraPermissionModalOpen(true);
      toast.error('Failed to access camera. Please ensure permissions are granted.', { duration: 4000 });
    }
  }, []);

  // Function to capture a frame and perform OCR
  const captureAndScan = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      setIsScanning(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/jpeg', 0.9);

        toast.promise(
          simulateOCR(imageDataURL),
          {
            loading: 'Scanning number plate...',
            success: (plate) => {
              if (LICENSE_PLATE_REGEX.test(plate)) {
                setLicensePlate(plate);
                stopCamera(); // Stop camera after successful scan
                return `Scanned: ${plate}`;
              } else {
                // If simulated OCR returns an invalid format, treat it as an error
                throw new Error(`Invalid format: ${plate}. Please try again.`);
              }
            },
            error: (err) => {
              console.error("OCR Error:", err);
              return `Scan failed: ${err.message || 'Plate not recognized.'}`;
            },
          },
          {
            duration: 3000,
          }
        ).finally(() => {
          setIsScanning(false);
        });
      }
    }
  }, [stopCamera]);


  // Handles lookup of vehicle and purpose details
  const handleLookup = () => {
    if (!licensePlate) {
      showAppModal({
        title: "Input Required",
        description: "Please enter a license plate number to perform a lookup.",
        onConfirm: () => setIsModalOpen(false)
      });
      return;
    }

    if (!LICENSE_PLATE_REGEX.test(licensePlate)) {
      showAppModal({
        title: "Invalid License Plate Format",
        description: "License plate must be in the format: AA00AA0000 (e.g., TG01AB1234).",
        onConfirm: () => setIsModalOpen(false)
      });
      return;
    }

    const foundVehicle = registeredVehiclesData.find(v => v.licensePlate.toLowerCase() === licensePlate.toLowerCase());
    const foundPurpose = purposesData.find(p => p.name.toLowerCase() === purpose.toLowerCase());

    let relatedAuthorities = [];
    if (foundPurpose && foundPurpose.authorityIds.length > 0) {
      relatedAuthorities = foundPurpose.authorityIds.map(id => authoritiesData.find(a => a.id === id)).filter(Boolean);
    } else if (purpose) {
      // If a purpose is entered but no specific authority is linked, suggest General Reception
      const generalReception = authoritiesData.find(a => a.name === "General Reception");
      if (generalReception) {
        relatedAuthorities.push(generalReception);
      }
    }

    setLookupResults({
      vehicle: foundVehicle,
      purpose: foundPurpose,
      authorities: relatedAuthorities,
    });

    // Automatically select the authority if only one is found
    if (relatedAuthorities.length === 1) {
      setSelectedAuthorityId(relatedAuthorities[0].id);
    } else {
      setSelectedAuthorityId('');
    }
  };

  // Handles approving vehicle entry
  const handleApproveEntry = () => {
    if (!lookupResults || lookupResults.authorities.length === 0) {
      showAppModal({
        title: "Approval Required",
        description: "Please perform a lookup and ensure a relevant authority is identified before approving entry.",
        onConfirm: () => setIsModalOpen(false)
      });
      return;
    }

    const approvedByAuthority = authoritiesData.find(a => a.id === selectedAuthorityId);
    if (!approvedByAuthority) {
      showAppModal({
        title: "Authority Not Selected",
        description: "Please select an authority who approved the entry from the dropdown.",
        onConfirm: () => setIsModalOpen(false)
      });
      return;
    }

    const newLogEntry = {
      id: Date.now().toString(), // Unique ID for the log entry
      licensePlate: licensePlate.toUpperCase(),
      numPeople: parseInt(numPeople),
      purpose: purpose,
      approvedBy: approvedByAuthority.name,
      entryTime: new Date(),
      exitTime: null,
      status: 'inside',
      securityPersonnelId: 'local_user', // Placeholder for actual security personnel ID
    };

    setVehiclesInside((prev) => [...prev, newLogEntry]); // Add to vehicles currently inside

    showAppModal({
      title: "Entry Approved",
      description: `Vehicle ${licensePlate.toUpperCase()} has been successfully approved and logged.`,
      onConfirm: () => setIsModalOpen(false)
    });

    // Clear form fields after approval
    setLicensePlate('');
    setNumPeople(1);
    setPurpose('');
    setLookupResults(null);
    setSelectedAuthorityId('');
  };

  // Handles marking a vehicle as exited
  const handleMarkExit = (logId) => {
    showAppModal({
      title: "Confirm Exit",
      description: "Are you sure you want to mark this vehicle as exited? This action will move it to history.",
      showCancel: true,
      onConfirm: () => {
        setIsModalOpen(false);
        setVehiclesInside((prevInside) => {
          const vehicleToExit = prevInside.find((v) => v.id === logId);
          if (!vehicleToExit) return prevInside;

          const updatedVehicle = {
            ...vehicleToExit,
            exitTime: new Date(),
            status: 'exited',
          };

          setVehicleHistory((prevHistory) => [...prevHistory, updatedVehicle]); // Add to history
          return prevInside.filter((v) => v.id !== logId); // Remove from vehicles inside
        });
        toast.success("Vehicle exit time recorded successfully!");
      },
      onCancel: () => setIsModalOpen(false)
    });
  };

  // Downloads vehicle history as an XLSX file (new function)
  const downloadHistoryAsXlsx = () => {
    if (vehicleHistory.length === 0) {
      toast.error("No history to download.");
      return;
    }

    // Prepare data for XLSX
    const data = vehicleHistory.map(entry => ({
      'ID': entry.id,
      'License Plate': entry.licensePlate,
      'Number of People': entry.numPeople,
      'Purpose': entry.purpose,
      'Approved By': entry.approvedBy,
      'Entry Time': new Date(entry.entryTime).toLocaleString(),
      'Exit Time': entry.exitTime ? new Date(entry.exitTime).toLocaleString() : 'N/A',
      'Status': entry.status,
      'Security Personnel ID': entry.securityPersonnelId,
    }));

    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Vehicle History");

      const fileName = `vehicle_history_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Generate XLSX data as an array buffer
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      // Create a Blob from the array buffer
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      // Create an object URL for the Blob
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a); // Append to body to ensure it's clickable
      a.click(); // Programmatically click the link to trigger download
      document.body.removeChild(a); // Clean up by removing the link
      URL.revokeObjectURL(url); // Release the object URL
      toast.success("Vehicle history download initiated!");
    } catch (error) {
      console.error("Error generating or downloading XLSX file:", error);
      toast.error("Failed to download history. Please try again or check console for errors.");
    }
  };
  // Clears all vehicle history from local storage
  const clearVehicleHistory = () => {
    showAppModal({
      title: "Confirm Clear History",
      description: "Are you sure you want to clear ALL vehicle history? This action cannot be undone.",
      showCancel: true,
      onConfirm: () => {
        setVehicleHistory([]);
        localStorage.removeItem('vehicleHistory');
        setIsModalOpen(false);
        toast.success("Vehicle history cleared successfully!");
      },
      onCancel: () => setIsModalOpen(false)
    });
  };

  // --- Gemini API Integration Functions ---

  // Generic function to call Gemini API for text generation
  const callGeminiApi = async (prompt) => {
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Gemini API response structure unexpected:", result);
      throw new Error("Failed to get a valid response from Gemini API.");
    }
  };

  // Handles suggesting purpose details using Gemini API
  const handleSuggestPurposeDetails = async () => {
    if (!purpose) {
      toast.error("Please enter a purpose to get suggestions.");
      return;
    }

    setIsGeneratingPurpose(true);
    try {
      const allAuthorities = authoritiesData.map(auth => `${auth.name} (${auth.department}, Role: ${auth.role})`).join('; ');
      const prompt = `Given the purpose of entry '${purpose}' for a security gate, and the following known authorities: ${allAuthorities}. Suggest a more detailed or specific purpose. If it matches a known purpose (e.g., 'Meeting with Director'), elaborate on it. If not, suggest a general but relevant elaboration. Respond concisely, ideally in one sentence, starting with "Purpose:".`;

      const suggestedPurpose = await toast.promise(
        callGeminiApi(prompt),
        {
          loading: 'Generating purpose details...',
          success: 'Purpose details generated!',
          error: 'Failed to generate purpose details.',
        },
        { duration: 3000 }
      );

      showAppModal({
        title: "✨ Suggested Purpose Details",
        description: suggestedPurpose,
        onConfirm: () => {
          // Optionally allow user to apply the suggestion
          if (suggestedPurpose.startsWith("Purpose: ")) {
            setPurpose(suggestedPurpose.substring("Purpose: ".length).trim());
          } else {
            setPurpose(suggestedPurpose.trim());
          }
          setIsModalOpen(false);
        },
        onCancel: () => setIsModalOpen(false),
        showCancel: true // Allow user to dismiss without applying
      });

    } catch (error) {
      console.error("Error generating purpose details:", error);
      toast.error("Error generating purpose details. Please try again.");
    } finally {
      setIsGeneratingPurpose(false);
    }
  };

  // Handles generating screening questions using Gemini API
  const handleGenerateScreeningQuestions = async () => {
    if (!licensePlate && !purpose && numPeople === 0) {
      toast.error("Please provide license plate, purpose, or number of people to generate questions.");
      return;
    }

    setIsGeneratingQuestions(true);
    try {
      let vehicleInfo = lookupResults?.vehicle ? `registered as ${lookupResults.vehicle.purpose} by owner ${lookupResults.vehicle.ownerName}` : 'not pre-registered';
      let authorityInfo = lookupResults?.authorities?.length > 0 ? `approved by ${lookupResults.authorities.map(a => a.name).join(' and ')}` : 'no specific authority identified';

      const prompt = `For a vehicle with license plate '${licensePlate || 'N/A'}' entering with '${numPeople}' people for the purpose of '${purpose || 'N/A'}', and which is ${vehicleInfo} and ${authorityInfo}, suggest 2-3 concise questions security personnel should ask the visitor. Focus on verifying identity, confirming purpose, or security protocols. Respond as a bulleted list, each question prefixed with a bullet point.`;

      const generatedQuestions = await toast.promise(
        callGeminiApi(prompt),
        {
          loading: 'Generating screening questions...',
          success: 'Questions generated!',
          error: 'Failed to generate screening questions.',
        },
        { duration: 3000 }
      );

      showAppModal({
        title: "✨ Suggested Screening Questions",
        description: generatedQuestions,
        onConfirm: () => setIsModalOpen(false),
      });

    } catch (error) {
      console.error("Error generating screening questions:", error);
      toast.error("Error generating screening questions. Please try again.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };


  return (
    // Main container with gradient background and Inter font
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 font-inter text-gray-800 flex flex-col items-center">
      {/* Link to Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

      {/* General Purpose Modal (Dialog) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-8 rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-700">{modalContent.title}</DialogTitle>
            <DialogDescription className="text-gray-900 mt-2 text-base">{modalContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex justify-end space-x-3">
            {modalContent.showCancel && (
              <Button variant="outline" onClick={modalContent.onCancel || (() => setIsModalOpen(false))}>
                Cancel
              </Button>
            )}
            <Button onClick={modalContent.onConfirm || (() => setIsModalOpen(false))}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Camera Permission Error Modal */}
      <Dialog open={isCameraPermissionModalOpen} onOpenChange={setIsCameraPermissionModalOpen}>
        <DialogContent className="p-8 rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 flex items-center">
              <i className="fas fa-exclamation-triangle mr-3 text-red-500"></i>Camera Access Denied
            </DialogTitle>
            <DialogDescription className="text-gray-900 mt-4 text-base">
              <p className="mb-2">It looks like the application doesn't have permission to access your camera.</p>
              <p className="mb-2">To fix this, please follow these steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Look for a **camera icon** in your browser's address bar (usually near the URL).</li>
                <li>Click on it and select **"Always allow"** or **"Allow"** for this site.</li>
                <li>If you don't see the icon, go to your browser's **Settings** &gt; **Privacy and Security** &gt; **Site Settings** &gt; **Camera**. Find this website and grant permission.</li>
                <li>After granting permission, **refresh this page**.</li>
              </ol>
              <p className="mt-4 font-semibold">Then, try starting the camera again.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex justify-end">
            <Button onClick={() => setIsCameraPermissionModalOpen(false)}>
              Got It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Main Application Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-4 flex items-center justify-center">
          <i className="fas fa-shield-alt mr-4 text-blue-600"></i>Security Gate Management
        </h1>
        <p className="text-center text-base text-gray-600 mb-8">
          Efficiently manage vehicle entries and exits. Data is securely saved in your browser's local storage.
        </p>

        {/* Camera Feed & Control Section */}
        {isCameraActive && (
          <div className="mb-8 p-6 border border-blue-300 rounded-xl bg-blue-50 shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Live Camera Feed</h2>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-300 bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              {/* Overlay for guidance */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 h-1/4 border-4 border-yellow-500 rounded-lg opacity-80 animate-pulse"></div>
                <p className="absolute text-white text-lg font-semibold bg-black bg-opacity-60 px-3 py-1.5 rounded-lg">
                  Center number plate here
                </p>
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Hidden canvas for capturing frames */}
            <div className="flex justify-center gap-6 mt-6">
              <Button
                onClick={captureAndScan} // This button now triggers the capture and scan
                disabled={isScanning}
                className={`
                  relative flex items-center justify-center
                  w-24 h-24 rounded-full text-white text-4xl font-bold
                  transition-all duration-300 ease-in-out transform
                  ${isScanning
                    ? 'bg-orange-500 scale-95' // Orange for scanning
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800 scale-100 hover:scale-105' // Red for "capture"
                  }
                  focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-500 shadow-lg
                  ${isScanning ? 'opacity-70 cursor-not-allowed' : ''}
                `}
                title={isScanning ? "Scanning..." : "Capture License Plate"}
              >
                {isScanning ? (
                  <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <i className="fas fa-camera"></i>
                )}
                <span className="sr-only">Capture Number Plate</span>
              </Button>
              <Button
                onClick={stopCamera}
                className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-offset-2 shadow-lg"
                disabled={isScanning}
                title="Stop Camera"
              >
                <i className="fas fa-stop-circle"></i>
                <span className="sr-only">Stop Camera</span>
              </Button>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="mb-8 p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-md">
          <h2 className="text-2xl font-bold text-blue-700 mb-5">Vehicle Entry Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="licensePlate" className="block text-base font-medium text-gray-700 mb-2">License Plate</Label>
              <Input
                type="text"
                id="licensePlate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                placeholder="e.g., TG01AB1234"
                className="flex-grow text-base"
                readOnly={isCameraActive} // Disable manual input when camera is active
              />
              {!LICENSE_PLATE_REGEX.test(licensePlate) && licensePlate.length > 0 && (
                <p className="text-sm text-red-500 mt-2">Invalid format. Must be like TG01AB1234.</p>
              )}
              {/* Camera button moved below the license plate input field */}
              {!isCameraActive && ( // Only show this button if camera is not active
                <Button
                  onClick={startCamera} // This button now only starts the camera
                  className="mt-3 w-1/2 h-10 bg-gray-600 hover:bg-gray-700 text-white text-base shadow-md"
                  title="Start Camera to Scan License Plate"
                >
                  <i className="fas fa-video mr-2"></i> Start Camera
                </Button>
              )}
            </div>
            <div>
              <Label htmlFor="numPeople" className="block text-base font-medium text-gray-700 mb-2">Number of People</Label>
              <Input
                type="number"
                id="numPeople"
                value={numPeople}
                onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))} // Ensure at least 1 person
                min="1"
                className="text-base"
              />
            </div>
            <div className="md:col-span-2"> {/* Purpose takes full width on larger screens */}
              <Label htmlFor="purpose" className="block text-base font-medium text-gray-700 mb-2">Purpose of Entry</Label>
              <Input
                type="text"
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Meeting with Director"
                list="purpose-suggestions"
                className="text-base"
              />
              <datalist id="purpose-suggestions">
                {purposesData.map((p) => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>
          </div>
          <Button
            onClick={handleLookup}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 text-lg py-3 shadow-md"
            title="Lookup vehicle and purpose details"
          >
            <i className="fas fa-search mr-2"></i>Lookup Details
          </Button>
        </div>

        {/* Lookup Results Section */}
        {lookupResults && (
          <div className="mb-8 p-6 border border-green-300 rounded-xl bg-green-50 shadow-md">
            <h2 className="text-2xl font-bold text-green-700 mb-5">Lookup Results</h2>
            {lookupResults.vehicle && (
              <div className="mb-4 p-4 bg-green-100 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-2">Registered Vehicle Found:</h3>
                <p className="text-gray-700"><strong>Owner:</strong> {lookupResults.vehicle.ownerName}</p>
                <p className="text-gray-700"><strong>Registered Purpose:</strong> {lookupResults.vehicle.purpose}</p>
              </div>
            )}
            {!lookupResults.vehicle && (
              <p className="mb-4 text-green-800 p-4 bg-green-100 rounded-lg border border-green-200">
                <i className="fas fa-info-circle mr-2"></i>No pre-registered vehicle found for this license plate.
              </p>
            )}

            {lookupResults.authorities.length > 0 && (
              <div className="mb-4 p-4 bg-green-100 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-2">Related Authority/Authorities:</h3>
                {lookupResults.authorities.length > 1 ? (
                  <>
                    <Label htmlFor="selectAuthority" className="block text-base font-medium text-gray-700 mb-2">Select Approving Authority:</Label>
                    <Select value={selectedAuthorityId} onValueChange={setSelectedAuthorityId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Select an Authority --" />
                      </SelectTrigger>
                      <SelectContent>
                        {lookupResults.authorities.map(auth => (
                          <SelectItem key={auth.id} value={auth.id}>{auth.name} ({auth.department})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <p className="text-gray-700"><strong>Authority:</strong> {lookupResults.authorities[0].name} ({lookupResults.authorities[0].department})</p>
                )}

                {selectedAuthorityId && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
                    <h4 className="font-bold text-green-800 text-base mb-1">Contact Details:</h4>
                    {authoritiesData.find(a => a.id === selectedAuthorityId) && (
                      <>
                        <p className="text-gray-700"><strong>Phone:</strong> {authoritiesData.find(a => a.id === selectedAuthorityId).phone}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {authoritiesData.find(a => a.id === selectedAuthorityId).email}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {!lookupResults.authorities.length && purpose && (
              <p className="mb-4 text-green-800 p-4 bg-green-100 rounded-lg border border-green-200">
                <i className="fas fa-exclamation-circle mr-2"></i>No specific authority found for the stated purpose. Consider general visitor/delivery.
              </p>
            )}

            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
              <Button
                onClick={handleApproveEntry}
                className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 text-lg py-3 shadow-md"
                title="Approve vehicle entry"
              >
                <i className="fas fa-check-circle mr-2"></i>Approve Entry
              </Button>
              <Button
                onClick={() => setLookupResults(null)}
                variant="destructive"
                className="text-lg py-3 shadow-md"
                title="Deny entry or clear lookup results"
              >
                <i className="fas fa-times-circle mr-2"></i>Deny Entry / Clear
              </Button>
            </div>
            <Button
              onClick={handleGenerateScreeningQuestions}
              disabled={isGeneratingQuestions}
              className="mt-4 w-full bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 text-base py-3 shadow-md"
              title="Generate AI-powered screening questions"
            >
              {isGeneratingQuestions ? (
                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <i className="fas fa-question-circle mr-2"></i>
              )}
              Generate Screening Questions
            </Button>
          </div>
        )}

        {/* Vehicles Inside Section */}
        <div className="mb-8 p-6 border border-purple-300 rounded-xl bg-purple-50 shadow-md">
          <h2 className="text-2xl font-bold text-purple-700 mb-5">Vehicles Currently Inside ({vehiclesInside.length})</h2>
          {vehiclesInside.length === 0 ? (
            <p className="text-gray-600 p-4 bg-purple-100 rounded-lg border border-purple-200">
              <i className="fas fa-car-alt mr-2"></i>No vehicles currently inside.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full bg-white rounded-lg shadow-sm">
                <TableHeader>
                  <TableRow className="bg-purple-100 text-purple-800 uppercase text-sm leading-normal">
                    <TableHead className="py-3 px-6 text-left rounded-tl-lg">License Plate</TableHead>
                    <TableHead className="py-3 px-6 text-left">Purpose</TableHead>
                    <TableHead className="py-3 px-6 text-left">Entry Time</TableHead>
                    <TableHead className="py-3 px-6 text-left">Approved By</TableHead>
                    <TableHead className="py-3 px-6 text-center rounded-tr-lg">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-gray-700 text-base font-light">
                  {vehiclesInside.map((vehicle) => (
                    <TableRow key={vehicle.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="py-3 px-6 text-left whitespace-nowrap font-medium">{vehicle.licensePlate}</TableCell>
                      <TableCell className="py-3 px-6 text-left">{vehicle.purpose}</TableCell>
                      <TableCell className="py-3 px-6 text-left">
                        {new Date(vehicle.entryTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3 px-6 text-left">{vehicle.approvedBy}</TableCell>
                      <TableCell className="py-3 px-6 text-center">
                        <Button
                          onClick={() => handleMarkExit(vehicle.id)}
                          className="bg-red-500 text-white hover:bg-red-600 shadow-sm text-sm"
                          size="sm"
                          title="Mark vehicle as exited"
                        >
                          Mark Exit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Vehicle History Section */}
        <div className="p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            Vehicle History ({vehicleHistory.length})
            <div className="flex space-x-2 mt-3 sm:mt-0">
              <Button
                onClick={downloadHistoryAsXlsx} // Changed to XLSX download
                className="bg-green-600 text-white hover:bg-green-700 shadow-sm text-sm"
                size="sm"
                title="Download History as XLSX"
              >
                <i className="fas fa-file-excel mr-1"></i> XLSX
              </Button>
              <Button
                onClick={clearVehicleHistory}
                variant="destructive"
                size="sm"
                title="Clear All History"
              >
                <i className="fas fa-trash-alt mr-1"></i> Clear
              </Button>
            </div>
          </h2>
          {vehicleHistory.length === 0 ? (
            <p className="text-gray-600 p-4 bg-gray-100 rounded-lg border border-gray-200">
              <i className="fas fa-history mr-2"></i>No vehicle history recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full bg-white rounded-lg shadow-sm">
                <TableHeader>
                  <TableRow className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                    <TableHead className="py-3 px-6 text-left rounded-tl-lg">License Plate</TableHead>
                    <TableHead className="py-3 px-6 text-left">Purpose</TableHead>
                    <TableHead className="py-3 px-6 text-left">Entry Time</TableHead>
                    <TableHead className="py-3 px-6 text-left">Exit Time</TableHead>
                    <TableHead className="py-3 px-6 text-left">Approved By</TableHead>
                    <TableHead className="py-3 px-6 text-left rounded-tr-lg">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-gray-700 text-base font-light">
                  {vehicleHistory.sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()).map((vehicle) => (
                    <TableRow key={vehicle.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="py-3 px-6 text-left whitespace-nowrap font-medium">{vehicle.licensePlate}</TableCell>
                      <TableCell className="py-3 px-6 text-left">{vehicle.purpose}</TableCell>
                      <TableCell className="py-3 px-6 text-left">
                        {new Date(vehicle.entryTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3 px-6 text-left">
                        {vehicle.exitTime ? new Date(vehicle.exitTime).toLocaleString() : 'N/A'}
                      </TableCell>
                      <TableCell className="py-3 px-6 text-left">{vehicle.approvedBy}</TableCell>
                      <TableCell className="py-3 px-6 text-left">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          vehicle.status === 'inside' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                        }`}>
                          {vehicle.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* React Hot Toast Notifications */}
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;

// This is typically in src/index.tsx or src/main.tsx
// Wrapped in DOMContentLoaded listener for robustness
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error("Root element with ID 'root' not found in the document. Cannot mount React app.");
  }
});
