import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointments = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctorsData, currencySymbol, backendURL, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchDocInfo = () => {
    const foundDoc = doctorsData.find((doc) => doc._id === docId);
    setDocInfo(foundDoc || null);
  };

  const getAvailableSlots = () => {
    if (!docInfo) {
      setDocSlot([]);
      return;
    }

    const bookedSlots = docInfo.slots_Booked || docInfo.slots_booked || {};
    const slotsByDay = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      currentDate.setHours(10, 0, 0, 0);

      const daySlots = [];
      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      let slotDateTime = new Date(currentDate);
      while (slotDateTime < endTime) {
        const formattedTime = slotDateTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const day = slotDateTime.getDate();
        const month = slotDateTime.getMonth() + 1;
        const year = slotDateTime.getFullYear();
        const slotDate = `${day}-${month}-${year}`;
        const bookedForDate = bookedSlots[slotDate] || [];
        const isAvailable = !bookedForDate.includes(formattedTime);

        if (isAvailable) {
          daySlots.push({
            datetime: new Date(slotDateTime),
            time: formattedTime,
            slotDate,
          });
        }

        slotDateTime.setMinutes(slotDateTime.getMinutes() + 30);
      }

      if (daySlots.length > 0) {
        slotsByDay.push(daySlots);
      }
    }

    setDocSlot(slotsByDay);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please login to book appointment');
      navigate('/login');
      return;
    }

    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }

    try {
      const selectedSlot = docSlot[slotIndex]?.find((item) => item.time === slotTime);

      if (!selectedSlot) {
        toast.error('Please select a valid slot');
        return;
      }

      const date = selectedSlot.datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}-${month}-${year}`;

      const { data } = await axios.post(
        `${backendURL}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [docId, doctorsData]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo?.image} alt='' />
          </div>
          <div className='flex-1 border border-gray-400 rounded-lg p-8 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo?.name} <img className='w-5' src={assets.verified_icon} alt='' />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>
                {docInfo?.degree} - {docInfo?.speciality}
              </p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo?.experience}</button>
            </div>
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img className='w-5' src={assets.info_icon} alt='' />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo?.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment Fee: <span className='text-gray-600'>{currencySymbol}{docInfo?.fees}</span>
            </p>
          </div>
        </div>

        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {docSlot.length > 0 &&
              docSlot.map((item, index) => (
                <div
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime('');
                  }}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
                  }`}
                  key={index}
                >
                  <p>{item[0] ? daysOfWeek[item[0].datetime.getDay()] : ''}</p>
                  <p>{item[0] ? item[0].datetime.getDate() : ''}</p>
                </div>
              ))}
          </div>

          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlot[slotIndex] &&
              docSlot[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'
                  }`}
                  key={`${item.time}-${index}`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light py-3 px-14 rounded-full my-6'>
            Book Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo?.speciality} />
      </div>
    )
  );
};

export default Appointments;
