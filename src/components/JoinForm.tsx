import { useState, useEffect } from 'react';
import type { Founder } from '../lib/supabase';

type Tab = 'want' | 'already';

interface AgentInput {
  name: string;
  description: string;
}

export default function JoinForm() {
  const [tab, setTab] = useState<Tab>('want');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // "I want" fields
  const [wantName, setWantName] = useState('');
  const [wantCompany, setWantCompany] = useState('');
  const [wantCity, setWantCity] = useState('');
  const [wantWhatsApp, setWantWhatsApp] = useState('');

  // "Already" fields
  const [alreadyName, setAlreadyName] = useState('');
  const [alreadyCompany, setAlreadyCompany] = useState('');
  const [alreadyCity, setAlreadyCity] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [mentorSearch, setMentorSearch] = useState('');
  const [showMentorDropdown, setShowMentorDropdown] = useState(false);
  const [agents, setAgents] = useState<AgentInput[]>([
    { name: '', description: '' },
    { name: '', description: '' },
    { name: '', description: '' },
  ]);

  // Founders list for mentor search
  const [founders, setFounders] = useState<Pick<Founder, 'id' | 'name' | 'company'>[]>([]);

  useEffect(() => {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      import('@supabase/supabase-js').then(({ createClient }) => {
        const client = createClient(url, key);
        client
          .from('founders')
          .select('id, name, company')
          .eq('verified', true)
          .then(({ data }) => {
            if (data) setFounders(data);
          });
      });
    }
  }, []);

  const filteredMentors = founders.filter(
    (f) =>
      mentorSearch.length > 0 &&
      (f.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
        (f.company && f.company.toLowerCase().includes(mentorSearch.toLowerCase())))
  );

  const handleWantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Open WhatsApp with a pre-filled message
    const message = encodeURIComponent(
      `Hi Ashish, I'm ${wantName}${wantCompany ? ` from ${wantCompany}` : ''}${wantCity ? ` in ${wantCity}` : ''}. I want to become AI Native! #AINativeBharat`
    );
    window.open(`https://wa.me/919001236554?text=${message}`, '_blank');
    setSubmitted(true);
    setSubmitting(false);
  };

  const handleAlreadySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const filledAgents = agents.filter((a) => a.name.trim());
    if (filledAgents.length < 3) {
      setError('Please add at least 3 agents.');
      setSubmitting(false);
      return;
    }

    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setError('Submissions not configured yet. Please try again later.');
      setSubmitting(false);
      return;
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(url, key);

      // Find mentor's generation
      const mentor = founders.find((f) => f.id === mentorId);
      let generation = 1;
      if (mentor && mentorId) {
        const { data: mentorData } = await client
          .from('founders')
          .select('generation')
          .eq('id', mentorId)
          .single();
        if (mentorData) generation = mentorData.generation + 1;
      }

      const { error: insertError } = await client.from('founders').insert({
        name: alreadyName,
        company: alreadyCompany || null,
        city: alreadyCity || null,
        agents: filledAgents,
        mentor_id: mentorId || null,
        generation,
        verified: false,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="join" className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-4">
            <span role="img" aria-label="tree">&#x1F333;</span>
          </div>
          <h2 className="font-heading text-2xl text-white font-bold mb-3">
            {tab === 'want' ? "You're on the path!" : 'Submission received!'}
          </h2>
          <p className="text-subtle">
            {tab === 'want'
              ? "Ashish will connect with you on WhatsApp to get you started."
              : 'Your mentor will confirm. Once verified, you\'ll appear on the tree.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="join" className="py-24 px-6">
      <div className="max-w-lg mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white text-center mb-8">
          Join the tree
        </h2>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-dark-border mb-8">
          <button
            onClick={() => setTab('want')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              tab === 'want'
                ? 'bg-saffron text-dark'
                : 'bg-dark-card text-subtle hover:text-white'
            }`}
          >
            I want to become AI Native
          </button>
          <button
            onClick={() => setTab('already')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              tab === 'already'
                ? 'bg-saffron text-dark'
                : 'bg-dark-card text-subtle hover:text-white'
            }`}
          >
            I'm already AI Native
          </button>
        </div>

        {/* "I want" form */}
        {tab === 'want' && (
          <form onSubmit={handleWantSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name *"
              required
              value={wantName}
              onChange={(e) => setWantName(e.target.value)}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
            />
            <input
              type="text"
              placeholder="Company"
              value={wantCompany}
              onChange={(e) => setWantCompany(e.target.value)}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
            />
            <input
              type="text"
              placeholder="City"
              value={wantCity}
              onChange={(e) => setWantCity(e.target.value)}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
            />
            <input
              type="tel"
              placeholder="WhatsApp number *"
              required
              value={wantWhatsApp}
              onChange={(e) => setWantWhatsApp(e.target.value)}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-saffron text-dark font-semibold rounded-lg hover:bg-saffron-light transition-colors disabled:opacity-50"
            >
              {submitting ? 'Opening WhatsApp...' : 'Connect on WhatsApp'}
            </button>

            <p className="text-xs text-muted text-center">
              Opens a WhatsApp chat with Ashish to get you started.
            </p>
          </form>
        )}

        {/* "Already AI Native" form */}
        {tab === 'already' && (
          <form onSubmit={handleAlreadySubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name *"
              required
              value={alreadyName}
              onChange={(e) => setAlreadyName(e.target.value)}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
            />
            <input
              type="text"
              placeholder="Company"
              value={alreadyCompany}
              onChange={(e) => setAlreadyCompany(e.target.value)}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
            />
            <input
              type="text"
              placeholder="City"
              value={alreadyCity}
              onChange={(e) => setAlreadyCity(e.target.value)}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
            />

            {/* Mentor search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Who enabled you? (search by name)"
                value={mentorSearch}
                onChange={(e) => {
                  setMentorSearch(e.target.value);
                  setShowMentorDropdown(true);
                  if (!e.target.value) setMentorId('');
                }}
                onFocus={() => setShowMentorDropdown(true)}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
              />
              {showMentorDropdown && filteredMentors.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-dark-card border border-dark-border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {filteredMentors.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setMentorId(f.id);
                        setMentorSearch(`${f.name}${f.company ? ` (${f.company})` : ''}`);
                        setShowMentorDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-subtle hover:text-white hover:bg-dark-border transition-colors"
                    >
                      {f.name}
                      {f.company && <span className="text-muted"> — {f.company}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3 Agents */}
            <div className="space-y-3">
              <p className="text-sm text-subtle font-medium">Your 3 agents *</p>
              {agents.map((agent, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Agent ${i + 1} name`}
                    required
                    value={agent.name}
                    onChange={(e) => {
                      const updated = [...agents];
                      updated[i] = { ...updated[i], name: e.target.value };
                      setAgents(updated);
                    }}
                    className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors text-sm"
                  />
                  <input
                    type="text"
                    placeholder="What it does"
                    required
                    value={agent.description}
                    onChange={(e) => {
                      const updated = [...agents];
                      updated[i] = { ...updated[i], description: e.target.value };
                      setAgents(updated);
                    }}
                    className="flex-[2] px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors text-sm"
                  />
                </div>
              ))}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-saffron text-dark font-semibold rounded-lg hover:bg-saffron-light transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for verification'}
            </button>

            <p className="text-xs text-muted text-center">
              Your mentor will be asked to confirm. Once verified, you appear on the tree.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
