import React, { useState, useEffect } from 'react';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from '@/components/ui/label';

// Mock XML Data
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
    <Vehicle license_plate="KA01AB1234">
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

// Utility functions (parseXml, extractXmlData)
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

function App() {
  const [licensePlate, setLicensePlate] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [lookupResults, setLookupResults] = useState(null);
  const [selectedAuthorityId, setSelectedAuthorityId] = useState('');
  const [authoritiesData, setAuthoritiesData] = useState([]);
  const [purposesData, setPurposesData] = useState([]);
  const [registeredVehiclesData, setRegisteredVehiclesData] = useState([]);

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', onConfirm: null, onCancel: null, showCancel: false });

  useEffect(() => {
    const xmlDoc = parseXml(mockXmlData);
    const { authorities, purposes, registeredVehicles } = extractXmlData(xmlDoc);
    setAuthoritiesData(authorities);
    setPurposesData(purposes);
    setRegisteredVehiclesData(registeredVehicles);
  }, []);

  useEffect(() => {
    localStorage.setItem('vehiclesInside', JSON.stringify(vehiclesInside));
  }, [vehiclesInside]);

  useEffect(() => {
    localStorage.setItem('vehicleHistory', JSON.stringify(vehicleHistory));
  }, [vehicleHistory]);

  const showAppModal = ({ title, description, onConfirm, onCancel = null, showCancel = false }) => {
    setModalContent({ title, description, onConfirm, onCancel, showCancel });
    setIsModalOpen(true);
  };

  const handleLookup = () => {
    if (!licensePlate) {
      showAppModal({
        title: "Input Required",
        description: "Please enter a license plate number.",
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

    if (relatedAuthorities.length === 1) {
      setSelectedAuthorityId(relatedAuthorities[0].id);
    } else {
      setSelectedAuthorityId('');
    }
  };

  const handleApproveEntry = () => {
    if (!lookupResults || lookupResults.authorities.length === 0) {
      showAppModal({
        title: "Approval Required",
        description: "Please perform a lookup and ensure a relevant authority is identified before approving.",
        onConfirm: () => setIsModalOpen(false)
      });
      return;
    }

    const approvedByAuthority = authoritiesData.find(a => a.id === selectedAuthorityId);
    if (!approvedByAuthority) {
      showAppModal({
        title: "Authority Not Selected",
        description: "Please select an authority who approved the entry.",
        onConfirm: () => setIsModalOpen(false)
      });
      return;
    }

    const newLogEntry = {
      id: Date.now().toString(),
      licensePlate: licensePlate.toUpperCase(),
      numPeople: parseInt(numPeople),
      purpose: purpose,
      approvedBy: approvedByAuthority.name,
      entryTime: new Date(),
      exitTime: null,
      status: 'inside',
      securityPersonnelId: 'local_user',
    };

    setVehiclesInside((prev) => [...prev, newLogEntry]);
    
    showAppModal({
      title: "Entry Approved",
      description: `Vehicle ${licensePlate.toUpperCase()} has been approved and logged.`,
      onConfirm: () => setIsModalOpen(false)
    });

    setLicensePlate('');
    setNumPeople(1);
    setPurpose('');
    setLookupResults(null);
    setSelectedAuthorityId('');
  };

  const handleMarkExit = (logId) => {
    showAppModal({
      title: "Confirm Exit",
      description: "Are you sure you want to mark this vehicle as exited?",
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

          setVehicleHistory((prevHistory) => [...prevHistory, updatedVehicle]);
          return prevInside.filter((v) => v.id !== logId);
        });
        showAppModal({
          title: "Exit Recorded",
          description: "Vehicle exit time recorded successfully.",
          onConfirm: () => setIsModalOpen(false)
        });
      },
      onCancel: () => setIsModalOpen(false)
    });
  };

  // Placeholder for camera functionality
  const handleScanLicensePlate = () => {
    showAppModal({
      title: "Camera Scan (Placeholder)",
      description: "This feature would integrate with a mobile camera for license plate recognition. For now, please type the license plate manually.",
      onConfirm: () => setIsModalOpen(false)
    });
    // In a real mobile app, this would initiate camera access and LPR
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 font-inter text-gray-800 flex flex-col items-center">
      
      {/* Shadcn UI Dialog (Modal) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">{modalContent.title}</DialogTitle>
            <DialogDescription className="text-gray-700 mt-2">{modalContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end space-x-3">
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

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          <i className="fas fa-shield-alt mr-3"></i>Security Gate Management
        </h1>
        <p className="text-center text-sm text-gray-600 mb-4">
          Data is saved in your browser's local storage.
        </p>

        {/* Input Section */}
        <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Vehicle Entry Details</h2>
          <div className="flex flex-col gap-4 mb-4"> {/* Changed to flex-col for vertical stacking */}
            <div>
              <Label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">License Plate</Label>
              <div className="flex items-center space-x-2"> {/* Flex container for input and button */}
                <Input
                  type="text"
                  id="licensePlate"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  placeholder="e.g., KA01AB1234"
                  className="flex-grow" // Allows input to take available space
                />
                <Button onClick={handleScanLicensePlate} size="icon" className="shrink-0"> {/* Camera button */}
                  <i className="fas fa-camera"></i>
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="numPeople" className="block text-sm font-medium text-gray-700 mb-1">Number of People</Label>
              <Input
                type="number"
                id="numPeople"
                value={numPeople}
                onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">Purpose of Entry</Label>
              <Input
                type="text"
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Meeting with Director"
                list="purpose-suggestions" // Still using datalist for simple suggestions
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
            className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" // Custom Tailwind for button
          >
            <i className="fas fa-search mr-2"></i>Lookup Details
          </Button>
        </div>

        {/* Lookup Results Section */}
        {lookupResults && (
          <div className="mb-8 p-4 border border-green-200 rounded-lg bg-green-50">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Lookup Results</h2>
            {lookupResults.vehicle && (
              <div className="mb-4 p-3 bg-green-100 rounded-md">
                <h3 className="font-medium text-green-800">Registered Vehicle Found:</h3>
                <p><strong>Owner:</strong> {lookupResults.vehicle.ownerName}</p>
                <p><strong>Registered Purpose:</strong> {lookupResults.vehicle.purpose}</p>
              </div>
            )}
            {!lookupResults.vehicle && (
              <p className="mb-4 text-green-800">No pre-registered vehicle found for this license plate.</p>
            )}

            {lookupResults.authorities.length > 0 && (
              <div className="mb-4 p-3 bg-green-100 rounded-md">
                <h3 className="font-medium text-green-800">Related Authority/Authorities:</h3>
                {lookupResults.authorities.length > 1 ? (
                  <>
                    <Label htmlFor="selectAuthority" className="block text-sm font-medium text-gray-700 mb-1">Select Approving Authority:</Label>
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
                  <p><strong>Authority:</strong> {lookupResults.authorities[0].name} ({lookupResults.authorities[0].department})</p>
                )}

                {selectedAuthorityId && (
                  <div className="mt-3">
                    <h4 className="font-medium text-green-800">Contact Details:</h4>
                    {authoritiesData.find(a => a.id === selectedAuthorityId) && (
                      <>
                        <p><strong>Phone:</strong> {authoritiesData.find(a => a.id === selectedAuthorityId).phone}</p>
                        <p><strong>Email:</strong> {authoritiesData.find(a => a.id === selectedAuthorityId).email}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {!lookupResults.authorities.length && purpose && (
              <p className="mb-4 text-green-800">No specific authority found for the stated purpose. Consider general visitor/delivery.</p>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleApproveEntry}
                className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              >
                <i className="fas fa-check-circle mr-2"></i>Approve Entry
              </Button>
              <Button
                onClick={() => setLookupResults(null)}
                variant="destructive" // Use Shadcn's destructive variant for red button
              >
                <i className="fas fa-times-circle mr-2"></i>Deny Entry / Clear
              </Button>
            </div>
          </div>
        )}

        {/* Vehicles Inside Section */}
        <div className="mb-8 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Vehicles Currently Inside ({vehiclesInside.length})</h2>
          {vehiclesInside.length === 0 ? (
            <p className="text-gray-600">No vehicles currently inside.</p>
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
                <TableBody className="text-gray-700 text-sm font-light">
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
                          className="bg-red-500 text-white hover:bg-red-600 shadow-sm"
                          size="sm" // Use Shadcn's small button size
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
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Vehicle History ({vehicleHistory.length})</h2>
          {vehicleHistory.length === 0 ? (
            <p className="text-gray-600">No vehicle history recorded yet.</p>
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
                <TableBody className="text-gray-700 text-sm font-light">
                  {/* Sort history by entry time descending */}
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
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
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

      {/* Font Awesome for Icons (Keep this in your index.html or public/index.html) */}
      {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" /> */}
    </div>
  );
}

export default App;
