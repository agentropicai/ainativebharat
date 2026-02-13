import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Founder } from '../lib/supabase';

// Fallback data when Supabase isn't connected
const FALLBACK_FOUNDERS: Founder[] = [
  { id: '1', name: 'Ashish', company: 'Agentropic', city: 'Bangalore', agents: [{ name: 'Life OS', description: 'Processes conversations, extracts tasks' }, { name: 'Code Agent', description: 'Autonomous development agent' }, { name: 'Watcher', description: 'Monitors Gmail + WhatsApp, pushes alerts' }], mentor_id: null, generation: 0, verified: true, created_at: '' },
  { id: '2', name: 'Rahul', company: 'FinStack', city: 'Mumbai', agents: [{ name: 'GST Invoice Agent', description: 'Auto-generates GST invoices from orders' }, { name: 'Reconciliation Bot', description: 'Matches bank statements to invoices' }, { name: 'Compliance Checker', description: 'Flags regulatory issues in filings' }], mentor_id: '1', generation: 1, verified: true, created_at: '' },
  { id: '3', name: 'Priya', company: 'ShopEasy', city: 'Delhi', agents: [{ name: 'Inventory Tracker', description: 'Monitors stock levels across warehouses' }, { name: 'Customer Support Bot', description: 'Handles L1 support queries' }, { name: 'Returns Processor', description: 'Auto-processes return requests' }], mentor_id: '1', generation: 1, verified: true, created_at: '' },
  { id: '4', name: 'Vikram', company: 'BuildRight', city: 'Pune', agents: [{ name: 'Site Monitor', description: 'Tracks construction progress via photos' }, { name: 'Material Estimator', description: 'Estimates material needs from blueprints' }, { name: 'Vendor Coordinator', description: 'Manages vendor communications' }], mentor_id: '1', generation: 1, verified: true, created_at: '' },
  { id: '5', name: 'Ananya', company: 'EduBridge', city: 'Hyderabad', agents: [{ name: 'Curriculum Builder', description: 'Generates personalized learning paths' }, { name: 'Assessment Grader', description: 'Auto-grades subjective answers' }, { name: 'Parent Updater', description: 'Sends weekly progress to parents' }], mentor_id: '2', generation: 2, verified: true, created_at: '' },
  { id: '6', name: 'Karthik', company: 'AgriTech Solutions', city: 'Chennai', agents: [{ name: 'Crop Advisor', description: 'Recommends crops based on soil data' }, { name: 'Market Price Tracker', description: 'Tracks mandi prices in real-time' }, { name: 'Weather Alert Agent', description: 'Pushes weather warnings to farmers' }], mentor_id: '2', generation: 2, verified: true, created_at: '' },
  { id: '7', name: 'Meera', company: 'HealthFirst', city: 'Bangalore', agents: [{ name: 'Appointment Scheduler', description: 'Manages doctor appointments + reminders' }, { name: 'Lab Report Analyzer', description: 'Summarizes lab reports for patients' }, { name: 'Follow-up Agent', description: 'Ensures post-visit care compliance' }], mentor_id: '3', generation: 2, verified: true, created_at: '' },
  { id: '8', name: 'Arjun', company: 'LegalEase', city: 'Mumbai', agents: [{ name: 'Contract Reviewer', description: 'Flags risky clauses in contracts' }, { name: 'Case Research Bot', description: 'Finds relevant case law' }, { name: 'Filing Deadline Tracker', description: 'Tracks court filing deadlines' }], mentor_id: '3', generation: 2, verified: true, created_at: '' },
  { id: '9', name: 'Sneha', company: 'TravelKaro', city: 'Jaipur', agents: [{ name: 'Itinerary Planner', description: 'Creates custom travel itineraries' }, { name: 'Price Watcher', description: 'Monitors flight + hotel prices' }, { name: 'Review Aggregator', description: 'Summarizes hotel reviews' }], mentor_id: '4', generation: 2, verified: true, created_at: '' },
  { id: '10', name: 'Deepak', company: 'FoodChain', city: 'Ahmedabad', agents: [{ name: 'Order Optimizer', description: 'Batches and routes delivery orders' }, { name: 'Menu Pricer', description: 'Dynamic pricing based on demand' }, { name: 'Quality Checker', description: 'Monitors food quality ratings' }], mentor_id: '4', generation: 2, verified: true, created_at: '' },
  { id: '11', name: 'Riya', company: 'StyleBox', city: 'Delhi', agents: [{ name: 'Trend Spotter', description: 'Identifies fashion trends from social media' }, { name: 'Size Recommender', description: 'Predicts customer sizes from data' }, { name: 'Restock Alert', description: 'Alerts when bestsellers run low' }], mentor_id: '5', generation: 3, verified: true, created_at: '' },
  { id: '12', name: 'Nikhil', company: 'PropTech India', city: 'Gurgaon', agents: [{ name: 'Lead Qualifier', description: 'Scores and qualifies property leads' }, { name: 'Virtual Tour Agent', description: 'Schedules and follows up on tours' }, { name: 'Document Collector', description: 'Gathers buyer documents automatically' }], mentor_id: '5', generation: 3, verified: true, created_at: '' },
  { id: '13', name: 'Kavya', company: 'MediaMint', city: 'Bangalore', agents: [{ name: 'Content Calendar', description: 'Plans social media content weekly' }, { name: 'Analytics Reporter', description: 'Generates performance reports' }, { name: 'Hashtag Optimizer', description: 'Suggests optimal hashtags per post' }], mentor_id: '6', generation: 3, verified: true, created_at: '' },
  { id: '14', name: 'Suresh', company: 'FleetManage', city: 'Coimbatore', agents: [{ name: 'Route Optimizer', description: 'Calculates most efficient delivery routes' }, { name: 'Driver Tracker', description: 'Monitors driver locations + ETA' }, { name: 'Fuel Monitor', description: 'Tracks fuel consumption anomalies' }], mentor_id: '6', generation: 3, verified: true, created_at: '' },
  { id: '15', name: 'Pooja', company: 'HRFlow', city: 'Pune', agents: [{ name: 'Resume Screener', description: 'Shortlists candidates from applications' }, { name: 'Onboarding Bot', description: 'Guides new hires through onboarding' }, { name: 'Leave Manager', description: 'Processes leave requests automatically' }], mentor_id: '7', generation: 3, verified: true, created_at: '' },
  { id: '16', name: 'Amit', company: 'PayFlow', city: 'Hyderabad', agents: [{ name: 'Invoice Chaser', description: 'Follows up on overdue invoices' }, { name: 'Expense Categorizer', description: 'Auto-categorizes business expenses' }, { name: 'Cash Flow Predictor', description: 'Forecasts cash flow weekly' }], mentor_id: '7', generation: 3, verified: true, created_at: '' },
  { id: '17', name: 'Divya', company: 'GreenEnergy', city: 'Chennai', agents: [{ name: 'Solar Calculator', description: 'Estimates solar savings for leads' }, { name: 'Installation Scheduler', description: 'Manages installation timelines' }, { name: 'Maintenance Alerter', description: 'Monitors panel performance' }], mentor_id: '8', generation: 3, verified: true, created_at: '' },
  { id: '18', name: 'Rohan', company: 'CloudKitchen', city: 'Mumbai', agents: [{ name: 'Demand Forecaster', description: 'Predicts daily order volumes' }, { name: 'Supplier Orderer', description: 'Auto-orders from suppliers' }, { name: 'Waste Tracker', description: 'Minimizes food waste with data' }], mentor_id: '9', generation: 3, verified: true, created_at: '' },
  { id: '19', name: 'Lakshmi', company: 'TextileTech', city: 'Surat', agents: [{ name: 'Design Generator', description: 'Creates textile patterns from trends' }, { name: 'Order Tracker', description: 'Tracks bulk order status' }, { name: 'Quality Inspector', description: 'Flags defects in production' }], mentor_id: '9', generation: 3, verified: true, created_at: '' },
  { id: '20', name: 'Sanjay', company: 'PharmAssist', city: 'Lucknow', agents: [{ name: 'Prescription Validator', description: 'Checks drug interactions' }, { name: 'Stock Manager', description: 'Manages medicine inventory + expiry' }, { name: 'Delivery Coordinator', description: 'Manages medicine delivery logistics' }], mentor_id: '10', generation: 3, verified: true, created_at: '' },
];

interface TreeNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  company: string | null;
  city: string | null;
  agents: { name: string; description: string }[];
  generation: number;
  menteeCount: number;
}

interface TreeLink extends d3.SimulationLinkDatum<TreeNode> {
  source: string | TreeNode;
  target: string | TreeNode;
}

const GENERATION_COLORS = [
  '#f59e0b', // gen 0 — saffron (root)
  '#22c55e', // gen 1 — green
  '#3b82f6', // gen 2 — blue
  '#a855f7', // gen 3 — purple
  '#ec4899', // gen 4 — pink
];

export default function Tree() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; founder: TreeNode } | null>(null);
  const [founders, setFounders] = useState<Founder[]>(FALLBACK_FOUNDERS);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase if available
  useEffect(() => {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      import('@supabase/supabase-js').then(({ createClient }) => {
        const client = createClient(url, key);
        client
          .from('founders')
          .select('*')
          .eq('verified', true)
          .then(({ data }) => {
            if (data && data.length > 0) {
              setFounders(data);
            }
            setLoading(false);
          });
      });
    } else {
      setLoading(false);
    }
  }, []);

  // D3 force graph
  useEffect(() => {
    if (loading || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.max(500, Math.min(700, window.innerHeight * 0.7));

    // Build nodes and links
    const menteeCountMap = new Map<string, number>();
    founders.forEach((f) => {
      if (f.mentor_id) {
        menteeCountMap.set(f.mentor_id, (menteeCountMap.get(f.mentor_id) || 0) + 1);
      }
    });

    const nodes: TreeNode[] = founders.map((f) => ({
      id: f.id,
      name: f.name,
      company: f.company,
      city: f.city,
      agents: f.agents,
      generation: f.generation,
      menteeCount: menteeCountMap.get(f.id) || 0,
    }));

    const links: TreeLink[] = founders
      .filter((f) => f.mentor_id)
      .map((f) => ({
        source: f.mentor_id!,
        target: f.id,
      }));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    // Defs for glow
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink<TreeNode, TreeLink>(links).id((d) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6)
      .style('filter', 'url(#glow)');

    // Nodes
    const node = g
      .append('g')
      .selectAll<SVGGElement, TreeNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, TreeNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => 8 + d.menteeCount * 3)
      .attr('fill', (d) => GENERATION_COLORS[d.generation] || GENERATION_COLORS[GENERATION_COLORS.length - 1])
      .attr('fill-opacity', 0.8)
      .attr('stroke', (d) => GENERATION_COLORS[d.generation] || GENERATION_COLORS[GENERATION_COLORS.length - 1])
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.4)
      .style('filter', 'url(#glow)');

    // Node labels
    node
      .append('text')
      .text((d) => d.name)
      .attr('dy', (d) => -(12 + d.menteeCount * 3))
      .attr('text-anchor', 'middle')
      .attr('fill', '#a3a3a3')
      .attr('font-size', '11px')
      .attr('font-family', "'Space Grotesk', sans-serif")
      .attr('font-weight', '500')
      .style('pointer-events', 'none');

    // Click to show tooltip
    node.on('click', (event, d) => {
      event.stopPropagation();
      const rect = container.getBoundingClientRect();
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        founder: d,
      });
    });

    svg.on('click', () => setTooltip(null));

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as TreeNode).x!)
        .attr('y1', (d) => (d.source as TreeNode).y!)
        .attr('x2', (d) => (d.target as TreeNode).x!)
        .attr('y2', (d) => (d.target as TreeNode).y!);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Initial zoom to fit
    setTimeout(() => {
      const bounds = (g.node() as SVGGElement)?.getBBox();
      if (bounds) {
        const dx = bounds.width + 80;
        const dy = bounds.height + 80;
        const x = bounds.x - 40;
        const y = bounds.y - 40;
        const scale = Math.min(0.9, Math.min(width / dx, height / dy));
        const translate = [width / 2 - scale * (x + dx / 2), height / 2 - scale * (y + dy / 2)];
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
      }
    }, 1000);

    return () => {
      simulation.stop();
    };
  }, [founders, loading]);

  return (
    <section id="tree" className="py-12 px-6">
      <div ref={containerRef} className="relative w-full max-w-5xl mx-auto bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-muted animate-pulse font-mono">Loading tree...</div>
          </div>
        ) : (
          <svg ref={svgRef} className="w-full" />
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 bg-dark border border-dark-border rounded-lg shadow-2xl p-4 max-w-xs"
            style={{
              left: Math.min(tooltip.x, (containerRef.current?.clientWidth || 400) - 280),
              top: tooltip.y + 10,
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-heading text-white font-bold text-lg">{tooltip.founder.name}</h3>
                {tooltip.founder.company && (
                  <p className="text-subtle text-sm">{tooltip.founder.company}</p>
                )}
                {tooltip.founder.city && (
                  <p className="text-muted text-xs">{tooltip.founder.city}</p>
                )}
              </div>
              <button
                onClick={() => setTooltip(null)}
                className="text-muted hover:text-white text-lg leading-none ml-3"
              >
                x
              </button>
            </div>

            {tooltip.founder.agents.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted uppercase tracking-wider">Agents</p>
                {tooltip.founder.agents.map((agent, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-saffron font-medium">{agent.name}</span>
                    <span className="text-subtle"> — {agent.description}</span>
                  </div>
                ))}
              </div>
            )}

            {tooltip.founder.menteeCount > 0 && (
              <p className="mt-3 text-xs text-muted">
                Enabled {tooltip.founder.menteeCount} founder{tooltip.founder.menteeCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-muted">
        {['Started it', 'Enabled by them', 'Enabled by those', 'And so on'].map((label, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: GENERATION_COLORS[i] }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
