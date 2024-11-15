import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarToolbar } from '../components/calendar/CalendarToolbar';
import { AppointmentModal } from '../components/calendar/AppointmentModal';
import { CalendarSidebar } from '../components/calendar/CalendarSidebar';
import { useBusinessData } from '../hooks/useBusinessData';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  client: {
    id: string;
    first_name: string;
    last_name: string;
  };
  stylist: {
    id: string;
    first_name: string;
    last_name: string;
  };
  appointment_services: Array<{
    service: {
      id: string;
      name: string;
      duration: number;
    };
  }>;
}

export const Calendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data: appointments, loading, error } = useBusinessData<Appointment>('appointments', {
    select: `
      *,
      client:clients(id, first_name, last_name),
      stylist:profiles(id, first_name, last_name),
      appointment_services(
        service:services(id, name, duration)
      )
    `
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-red-600">Error loading appointments</p>
      </div>
    );
  }

  const events = (appointments || []).map(apt => ({
    id: apt.id,
    title: `${apt.appointment_services[0]?.service?.name || 'Servicio'} - ${apt.client?.first_name} ${apt.client?.last_name}`,
    start: new Date(apt.start_time),
    end: new Date(apt.end_time),
    client: apt.client,
    stylist: apt.stylist,
    services: apt.appointment_services.map(as => as.service),
    status: apt.status
  }));

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setIsModalOpen(true);
  };

  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: event.status === 'confirmed' ? '#7C3AED' : '#9CA3AF',
      borderRadius: '8px',
    };
    return { style };
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <CalendarSidebar />
      
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 h-full">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            defaultView="week"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CalendarToolbar,
            }}
            messages={{
              today: 'Hoy',
              previous: 'Anterior',
              next: 'Siguiente',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
            }}
          />
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        event={selectedEvent}
      />
    </div>
  );
};