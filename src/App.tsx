import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase
      .from('event_registrations')
      .insert({ name: name.trim(), phone: phone.trim() });

    if (error) {
      setStatus('error');
      setErrorMsg('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setStatus('success');
    setName('');
    setPhone('');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-black flex items-center justify-center">
            <svg
              className="w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">신청 완료</h1>
          <p className="text-gray-500 mb-8">이벤트 신청이 완료되었습니다.</p>
          <button
            onClick={() => setStatus('idle')}
            className="px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
          >
            다시 신청하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black mb-1">이벤트 신청서</h1>
          <div className="w-16 h-0.5 bg-black mb-4" />
          <p className="text-sm text-gray-500">
            아래 정보를 입력하고 신청 버튼을 눌러주세요.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
              이름
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-black placeholder:text-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
              전화번호
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-black placeholder:text-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          {/* Error message */}
          {status === 'error' && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'submitting' ? '신청 중...' : '신청하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
