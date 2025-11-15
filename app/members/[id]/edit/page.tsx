'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../../../components/Navigation';
import Link from 'next/link';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string | null;
  note: string | null;
}

interface Props { 
  params: Promise<{ id: string }> 
}

export default function EditMemberPage({ params }: Props) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/members/${id}`, {
          credentials: 'same-origin'
        });
        
        if (response.ok) {
          const memberData = await response.json();
          setMember({
            ...memberData,
            birthday: memberData.birthday ? new Date(memberData.birthday).toISOString().substring(0, 10) : null
          });
        } else {
          setError('找不到會員資料');
        }
      } catch (err) {
        setError('載入會員資料時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!member) return;

    setSubmitting(true);
    setError('');
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });

      if (response.ok) {
        router.push('/members?success=updated');
      } else {
        const errorData = await response.json();
        if (errorData.details?.fieldErrors) {
          setFieldErrors(errorData.details.fieldErrors);
        } else {
          setError(errorData.message || '更新失敗，請檢查輸入資料');
        }
      }
    } catch (err) {
      setError('網路連線錯誤，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Navigation>
        <div className="max-w-2xl mx-auto">
          <div className="muji-card text-center">
            <div className="text-4xl mb-4" aria-hidden="true">⏳</div>
            <p style={{ color: 'var(--muji-soft-gray)' }}>載入中...</p>
          </div>
        </div>
      </Navigation>
    );
  }

  if (!member) {
    return (
      <Navigation>
        <div className="max-w-2xl mx-auto">
          <div className="muji-card text-center">
            <div className="text-4xl mb-4" aria-hidden="true">❌</div>
            <h1 className="text-xl font-light mb-4" style={{ color: 'var(--muji-charcoal)' }}>
              找不到會員
            </h1>
            <p className="mb-6" style={{ color: 'var(--muji-soft-gray)' }}>
              {error || '指定的會員不存在或已被刪除'}
            </p>
            <Link href="/members" className="muji-btn">
              返回會員列表
            </Link>
          </div>
        </div>
      </Navigation>
    );
  }

  return (
    <Navigation>
      <div className="max-w-2xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/members" 
              className="muji-link text-sm"
              aria-label="返回會員列表"
            >
              ← 返回會員列表
            </Link>
          </div>
          <h1 className="text-2xl font-light mb-2" style={{ color: 'var(--muji-charcoal)' }}>
            編輯會員資料
          </h1>
          <p className="text-sm" style={{ color: 'var(--muji-soft-gray)' }}>
            會員 ID: {member.id} - {member.name}
          </p>
        </div>

        {/* 表單卡片 */}
        <div className="muji-card">
          {error && (
            <div 
              className="muji-error mb-6" 
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* 基本資訊 */}
            <fieldset>
              <legend className="text-lg font-light mb-4" style={{ color: 'var(--muji-charcoal)' }}>
                基本資訊
              </legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="muji-label">
                    姓名 <span className="text-red-500" aria-label="必填">*</span>
                  </label>
                  <input 
                    id="name"
                    name="name" 
                    required 
                    defaultValue={member.name}
                    placeholder="請輸入會員姓名" 
                    className={`muji-input ${fieldErrors.name ? 'muji-input-error' : ''}`}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    autoComplete="name"
                  />
                  {fieldErrors.name && (
                    <p id="name-error" className="text-sm mt-1" style={{ color: 'var(--muji-accent-red)' }}>
                      {fieldErrors.name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="birthday" className="muji-label">
                    生日
                  </label>
                  <input 
                    id="birthday"
                    name="birthday" 
                    type="date" 
                    defaultValue={member.birthday || ''}
                    className="muji-input"
                    autoComplete="bday"
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--muji-soft-gray)' }}>
                    選填項目
                  </p>
                </div>
              </div>
            </fieldset>

            {/* 聯絡資訊 */}
            <fieldset>
              <legend className="text-lg font-light mb-4" style={{ color: 'var(--muji-charcoal)' }}>
                聯絡資訊
              </legend>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="muji-label">
                    電話號碼 <span className="text-red-500" aria-label="必填">*</span>
                  </label>
                  <input 
                    id="phone"
                    name="phone" 
                    required 
                    type="tel"
                    defaultValue={member.phone}
                    placeholder="例: 0912345678 或 02-12345678" 
                    className={`muji-input ${fieldErrors.phone ? 'muji-input-error' : ''}`}
                    aria-describedby={fieldErrors.phone ? "phone-error" : "phone-help"}
                    autoComplete="tel"
                  />
                  {fieldErrors.phone ? (
                    <p id="phone-error" className="text-sm mt-1" style={{ color: 'var(--muji-accent-red)' }}>
                      {fieldErrors.phone[0]}
                    </p>
                  ) : (
                    <p id="phone-help" className="text-xs mt-1" style={{ color: 'var(--muji-soft-gray)' }}>
                      支援手機號碼、市話或國際電話格式
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="muji-label">
                    電子郵件 <span className="text-red-500" aria-label="必填">*</span>
                  </label>
                  <input 
                    id="email"
                    name="email" 
                    required 
                    type="email" 
                    defaultValue={member.email}
                    placeholder="example@email.com" 
                    className={`muji-input ${fieldErrors.email ? 'muji-input-error' : ''}`}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    autoComplete="email"
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="text-sm mt-1" style={{ color: 'var(--muji-accent-red)' }}>
                      {fieldErrors.email[0]}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* 備註 */}
            <fieldset>
              <legend className="text-lg font-light mb-4" style={{ color: 'var(--muji-charcoal)' }}>
                其他資訊
              </legend>
              
              <div>
                <label htmlFor="note" className="muji-label">
                  備註
                </label>
                <textarea 
                  id="note"
                  name="note" 
                  defaultValue={member.note || ''}
                  placeholder="可輸入額外的會員資訊或備註..." 
                  className="muji-input" 
                  rows={4}
                  maxLength={2000}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--muji-soft-gray)' }}>
                  選填項目，最多 2000 字元
                </p>
              </div>
            </fieldset>

            {/* 操作按鈕 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t" style={{ borderColor: 'var(--muji-light-gray)' }}>
              <button 
                type="submit" 
                disabled={submitting}
                className="muji-btn flex-1 sm:flex-none"
                aria-describedby={submitting ? "submitting-status" : undefined}
              >
                {submitting ? (
                  <>
                    <span className="mr-2" aria-hidden="true">⏳</span>
                    更新中...
                  </>
                ) : (
                  <>
                    <span className="mr-2" aria-hidden="true">✓</span>
                    確認更新
                  </>
                )}
              </button>
              
              <Link 
                href="/members" 
                className="muji-btn-secondary flex-1 sm:flex-none text-center"
              >
                取消
              </Link>
            </div>
            
            {submitting && (
              <div 
                id="submitting-status" 
                className="sr-only" 
                aria-live="polite"
              >
                正在更新會員資料，請稍候
              </div>
            )}
          </form>
        </div>
      </div>
    </Navigation>
  );
}
