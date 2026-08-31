/**
 * CERO RIESGO ASESORÍAS Y COACHING - JAVASCRIPT CORE
 * Cotizador Inteligente con Costos Logísticos Regionales Ocultos, Sobretasa Minería,
 * Multicanal WhatsApp (+56950089957), Facebook, LinkedIn & CRM Local
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initFloatingContact();
  initCalculatorEngine();
  initLeadManagement();
});

/* ==========================================================================
   1. NAVEGACIÓN MÓVIL
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Cerrar menú al hacer clic en enlaces
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }
}

/* ==========================================================================
   2. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Cerrar otros
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Alternar el actual
        item.classList.toggle('active', !isActive);
      });
    }
  });
}

/* ==========================================================================
   3. WIDGET FLOTANTE DE CONTACTO RÁPIDO
   ========================================================================== */
function initFloatingContact() {
  const toggleBtn = document.getElementById('floatingToggle');
  const menu = document.getElementById('floatingMenu');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   4. MOTOR DEL COTIZADOR AUTOMÁTICO INTELIGENTE (CHILE)
   ========================================================================== */

// Costos logísticos de terreno por región en Chile (pasajes aéreos/terrestres, camioneta/vehículo faena, viáticos/alojamiento)
// Estos costos se incorporan internamente en el valor del servicio y NO se desglosan al cliente.
const REGIONAL_LOGISTICS_COSTS = {
  'metropolitana': { name: 'Región Metropolitana (Santiago)', logisticsCost: 0, flight: 0, vehicle: 0, lodging: 0 },
  'antofagasta': { name: 'Región de Antofagasta (Calama / Antofagasta)', logisticsCost: 1100000, flight: 300000, vehicle: 500000, lodging: 300000 },
  'tarapaca': { name: 'Región de Tarapacá (Iquique / Pozo Almonte)', logisticsCost: 980000, flight: 280000, vehicle: 450000, lodging: 250000 },
  'arica': { name: 'Región de Arica y Parinacota', logisticsCost: 990000, flight: 290000, vehicle: 450000, lodging: 250000 },
  'atacama': { name: 'Región de Atacama (Copiapó / Vallenar)', logisticsCost: 880000, flight: 260000, vehicle: 400000, lodging: 220000 },
  'coquimbo': { name: 'Región de Coquimbo (La Serena / Coquimbo / Ovalle)', logisticsCost: 480000, flight: 150000, vehicle: 220000, lodging: 110000 },
  'valparaiso': { name: 'Región de Valparaíso (Valparaíso / Viña / Los Andes)', logisticsCost: 180000, flight: 0, vehicle: 120000, lodging: 60000 },
  'ohiggins': { name: 'Región de O\'Higgins (Rancagua / Machalí)', logisticsCost: 160000, flight: 0, vehicle: 100000, lodging: 60000 },
  'maule': { name: 'Región del Maule (Talca / Curicó / Linares)', logisticsCost: 280000, flight: 0, vehicle: 160000, lodging: 120000 },
  'nuble': { name: 'Región de Ñuble (Chillán)', logisticsCost: 380000, flight: 120000, vehicle: 160000, lodging: 100000 },
  'biobio': { name: 'Región del Biobío (Concepción / Talcahuano / Los Ángeles)', logisticsCost: 580000, flight: 180000, vehicle: 250000, lodging: 150000 },
  'araucania': { name: 'Región de La Araucanía (Temuco / Villarrica)', logisticsCost: 640000, flight: 200000, vehicle: 280000, lodging: 160000 },
  'los_rios': { name: 'Región de Los Ríos (Valdivia)', logisticsCost: 660000, flight: 210000, vehicle: 280000, lodging: 170000 },
  'los_lagos': { name: 'Región de Los Lagos (Puerto Montt / Osorno / Chiloé)', logisticsCost: 760000, flight: 240000, vehicle: 320000, lodging: 200000 },
  'aysen': { name: 'Región de Aysén (Coyhaique / Puerto Aysén)', logisticsCost: 1150000, flight: 350000, vehicle: 500000, lodging: 300000 },
  'magallanes': { name: 'Región de Magallanes (Punta Arenas / Natales)', logisticsCost: 1250000, flight: 380000, vehicle: 520000, lodging: 350000 }
};

// Precios referenciales de mercado en Chile (CLP) según tamaño y complejidad
// En MINERÍA se incrementan considerablemente los valores (multiplicador 2.2x - 2.6x)
const PRICING_RULES = {
  services: {
    'carpeta_arranque': {
      name: 'Confección Carpeta de Arranque / Acreditación Express',
      basePrice: 320000,
      workerMultiplier: { '1-9': 1.0, '10-25': 1.3, '26-100': 1.7, '100+': 2.2 },
      industryMultiplier: { 'construccion': 1.25, 'mineria': 2.4, 'servicios': 1.0, 'comercio': 1.0, 'transporte': 1.2, 'salud': 1.15 },
      days: '48 a 72 hrs hábiles',
      requiresFieldDeployment: true
    },
    'ley_karin': {
      name: 'Implementación Integral Ley Karin (Ley 21.643)',
      basePrice: 380000,
      workerMultiplier: { '1-9': 1.0, '10-25': 1.35, '26-100': 1.85, '100+': 2.5 },
      industryMultiplier: { 'construccion': 1.15, 'mineria': 2.2, 'servicios': 1.1, 'comercio': 1.1, 'transporte': 1.15, 'salud': 1.25 },
      days: '3 a 5 días hábiles',
      requiresFieldDeployment: false
    },
    'protocolos_minsal': {
      name: 'Implementación Protocolos MINSAL (TMERT, PREXOR, PLANESI, CEAL-SM)',
      basePrice: 360000,
      workerMultiplier: { '1-9': 1.0, '10-25': 1.35, '26-100': 1.8, '100+': 2.3 },
      industryMultiplier: { 'construccion': 1.35, 'mineria': 2.5, 'servicios': 1.0, 'comercio': 1.05, 'transporte': 1.25, 'salud': 1.3 },
      days: '5 a 7 días hábiles',
      requiresFieldDeployment: true
    },
    'asesoria_mensual': {
      name: 'Asesoría Continua Mensual SST (Experto Asignado a Faena)',
      basePrice: 450000,
      workerMultiplier: { '1-9': 1.0, '10-25': 1.45, '26-100': 2.0, '100+': 2.8 },
      industryMultiplier: { 'construccion': 1.3, 'mineria': 2.6, 'servicios': 1.0, 'comercio': 1.1, 'transporte': 1.25, 'salud': 1.2 },
      days: 'Mensual recurrente',
      requiresFieldDeployment: true
    },
    'riohs_iper': {
      name: 'Actualización RIOHS + Matrices IPER + IRL (Información de Riesgos Laborales)',
      basePrice: 260000,
      workerMultiplier: { '1-9': 1.0, '10-25': 1.25, '26-100': 1.6, '100+': 2.0 },
      industryMultiplier: { 'construccion': 1.2, 'mineria': 2.3, 'servicios': 1.0, 'comercio': 1.0, 'transporte': 1.15, 'salud': 1.15 },
      days: '3 a 4 días hábiles',
      requiresFieldDeployment: false
    },
    'coaching_charlas': {
      name: 'Capacitación, Charlas & Coaching Ontológico de Liderazgo',
      basePrice: 290000,
      workerMultiplier: { '1-9': 1.0, '10-25': 1.25, '26-100': 1.6, '100+': 2.1 },
      industryMultiplier: { 'construccion': 1.15, 'mineria': 2.3, 'servicios': 1.0, 'comercio': 1.0, 'transporte': 1.15, 'salud': 1.15 },
      days: 'A coordinar (Presencial/Online)',
      requiresFieldDeployment: true
    }
  }
};

let currentQuoteData = null;

function initCalculatorEngine() {
  const calcForm = document.getElementById('quickQuoteForm');
  if (!calcForm) return;

  // Actualizar cálculo automáticamente ante cambios
  const inputs = calcForm.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('change', calculateQuote);
    input.addEventListener('input', calculateQuote);
  });

  // Botón enviar cotización a WhatsApp
  const btnQuoteWhatsapp = document.getElementById('btnQuoteWhatsapp');
  if (btnQuoteWhatsapp) {
    btnQuoteWhatsapp.addEventListener('click', sendQuoteToWhatsApp);
  }

  // Botón imprimir/descargar
  const btnPrintQuote = document.getElementById('btnPrintQuote');
  if (btnPrintQuote) {
    btnPrintQuote.addEventListener('click', () => {
      window.print();
    });
  }

  // Ejecutar cálculo inicial
  calculateQuote();
}

function calculateQuote() {
  const industryInput = document.querySelector('input[name="industry"]:checked');
  const workersInput = document.querySelector('input[name="workers"]:checked');
  const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
  
  const clientName = document.getElementById('quoteName')?.value || 'Estimado(a) Cliente';
  const clientCompany = document.getElementById('quoteCompany')?.value || 'Su Empresa';
  const clientPhone = document.getElementById('quotePhone')?.value || '+56 9 5008 9957';
  const clientEmail = document.getElementById('quoteEmail')?.value || 'contacto@empresa.cl';
  const clientRegionKey = document.getElementById('quoteRegion')?.value || 'metropolitana';
  const clientCity = document.getElementById('quoteCity')?.value || 'Santiago';

  const industry = industryInput ? industryInput.value : 'construccion';
  const workers = workersInput ? workersInput.value : '10-25';

  const regionInfo = REGIONAL_LOGISTICS_COSTS[clientRegionKey] || REGIONAL_LOGISTICS_COSTS['metropolitana'];
  const regionalExtraCost = regionInfo.logisticsCost || 0;

  const selectedServices = [];
  let baseServicesSubtotal = 0;
  let servicesNeedingDeployment = 0;

  serviceCheckboxes.forEach(cb => {
    const serviceKey = cb.value;
    const rule = PRICING_RULES.services[serviceKey];
    if (rule) {
      const wMult = rule.workerMultiplier[workers] || 1.0;
      const iMult = rule.industryMultiplier[industry] || 1.0;
      
      // Costo base del servicio con multiplicadores de tamaño e industria
      const rawPrice = Math.round((rule.basePrice * wMult * iMult) / 1000) * 1000;
      
      if (rule.requiresFieldDeployment) {
        servicesNeedingDeployment++;
      }

      baseServicesSubtotal += rawPrice;
      selectedServices.push({
        key: serviceKey,
        name: rule.name,
        rawPrice: rawPrice,
        price: rawPrice, // Se ajustará proporcionalmente con los costos logísticos integrados
        days: rule.days,
        requiresField: rule.requiresFieldDeployment
      });
    }
  });

  // Si no ha seleccionado ningún servicio, pre-seleccionar uno por defecto
  if (selectedServices.length === 0) {
    const defaultRule = PRICING_RULES.services['carpeta_arranque'];
    const wMult = defaultRule.workerMultiplier[workers] || 1.0;
    const iMult = defaultRule.industryMultiplier[industry] || 1.0;
    const rawPrice = Math.round((defaultRule.basePrice * wMult * iMult) / 1000) * 1000;
    baseServicesSubtotal = rawPrice;
    servicesNeedingDeployment = 1;
    selectedServices.push({
      key: 'carpeta_arranque',
      name: defaultRule.name,
      rawPrice: rawPrice,
      price: rawPrice,
      days: defaultRule.days,
      requiresField: true
    });
  }

  // Integración de costos logísticos regionales (pasajes, vehículo, alojamiento):
  // Si la región es distinta a la RM y al menos un servicio requiere despliegue en terreno,
  // se distribuye el costo logístico de forma transparente entre los servicios seleccionados.
  let totalLogisticsDistributed = 0;
  if (regionalExtraCost > 0 && servicesNeedingDeployment > 0) {
    totalLogisticsDistributed = regionalExtraCost;
    
    // Distribuir el costo logístico entre los servicios proporcionalmente
    selectedServices.forEach(s => {
      const proportion = s.rawPrice / baseServicesSubtotal;
      const logisticsShare = Math.round((totalLogisticsDistributed * proportion) / 1000) * 1000;
      s.price = s.rawPrice + logisticsShare;
    });
  } else {
    selectedServices.forEach(s => {
      s.price = s.rawPrice;
    });
  }

  const subtotalWithLogistics = selectedServices.reduce((acc, s) => acc + s.price, 0);

  // Descuento por paquete (12% si lleva 2 o más servicios)
  const discountRate = selectedServices.length > 1 ? 0.12 : 0;
  const discountAmount = Math.round((subtotalWithLogistics * discountRate) / 1000) * 1000;
  const totalNeto = subtotalWithLogistics - discountAmount;
  const iva = Math.round(totalNeto * 0.19);
  const totalConIva = totalNeto + iva;

  // Generar Folio
  const today = new Date();
  const folio = `CR-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  currentQuoteData = {
    folio: folio,
    date: today.toLocaleDateString('es-CL'),
    client: {
      name: clientName,
      company: clientCompany,
      phone: clientPhone,
      email: clientEmail,
      regionKey: clientRegionKey,
      regionName: regionInfo.name,
      city: clientCity
    },
    industry: industry,
    workers: workers,
    services: selectedServices,
    subtotal: subtotalWithLogistics,
    discount: discountAmount,
    totalNeto: totalNeto,
    iva: iva,
    totalConIva: totalConIva,
    // Metadata interna de costos de terreno (para la base de datos interna)
    internalLogistics: {
      total: totalLogisticsDistributed,
      flight: regionInfo.flight,
      vehicle: regionInfo.vehicle,
      lodging: regionInfo.lodging
    }
  };

  renderQuoteCard(currentQuoteData);
}

function renderQuoteCard(data) {
  const folioEl = document.getElementById('renderFolio');
  const dateEl = document.getElementById('renderDate');
  const companyEl = document.getElementById('renderCompany');
  const contactEl = document.getElementById('renderContact');
  const itemsListEl = document.getElementById('renderItemsList');
  const totalAmountEl = document.getElementById('renderTotalPrice');
  const discountRowEl = document.getElementById('renderDiscountRow');

  if (folioEl) folioEl.innerText = data.folio;
  if (dateEl) dateEl.innerText = data.date;
  if (companyEl) {
    const industryLabel = data.industry === 'mineria' ? '⛏️ Minería' : (data.industry === 'construccion' ? '🏗️ Construcción' : data.industry.toUpperCase());
    companyEl.innerText = `${data.client.company} (${industryLabel} - ${data.workers} trab.)`;
  }
  if (contactEl) {
    contactEl.innerText = `${data.client.name} | ${data.client.city} (${data.client.regionName})`;
  }

  if (itemsListEl) {
    itemsListEl.innerHTML = data.services.map(s => `
      <li class="quote-item-row">
        <span><i class="fas fa-check-circle text-success" style="margin-right: 6px;"></i>${s.name}</span>
        <strong>$${formatCLP(s.price)}</strong>
      </li>
    `).join('');
  }

  if (discountRowEl) {
    if (data.discount > 0) {
      discountRowEl.style.display = 'flex';
      discountRowEl.innerHTML = `
        <span class="text-success"><i class="fas fa-tag" style="margin-right: 6px;"></i>Descuento Plan Multitarea (12% OFF)</span>
        <strong class="text-success">-$${formatCLP(data.discount)}</strong>
      `;
    } else {
      discountRowEl.style.display = 'none';
    }
  }

  if (totalAmountEl) {
    totalAmountEl.innerText = `$${formatCLP(data.totalNeto)} + IVA`;
  }
}

function formatCLP(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* ==========================================================================
   5. ENVÍO DE COTIZACIÓN POR WHATSAPP Y REGISTRO EN CRM
   ========================================================================== */
function sendQuoteToWhatsApp() {
  if (!currentQuoteData) {
    calculateQuote();
  }

  // Guardar lead en la base de datos local
  saveLeadToDatabase(currentQuoteData);

  const servicesText = currentQuoteData.services
    .map((s, idx) => `  ${idx + 1}. ${s.name} ($${formatCLP(s.price)})`)
    .join('\n');

  const discountText = currentQuoteData.discount > 0 
    ? `\n🎁 *Descuento Especial:* -$${formatCLP(currentQuoteData.discount)} (12% OFF)`
    : '';

  const industryName = currentQuoteData.industry === 'mineria' ? 'Minería & Faenas' : currentQuoteData.industry;

  const message = `👋 *¡Hola Cero Riesgo Asesorías y Coaching!*\n` +
    `Acabo de generar una cotización formal desde su sitio web:\n\n` +
    `📋 *FOLIO:* ${currentQuoteData.folio}\n` +
    `🏢 *Empresa:* ${currentQuoteData.client.company}\n` +
    `🏭 *Rubro:* ${industryName}\n` +
    `👤 *Contacto:* ${currentQuoteData.client.name}\n` +
    `📞 *Teléfono:* ${currentQuoteData.client.phone}\n` +
    `📧 *Email:* ${currentQuoteData.client.email}\n` +
    `📍 *Ubicación del Servicio:* ${currentQuoteData.client.city} (${currentQuoteData.client.regionName})\n` +
    `👥 *Dotación:* ${currentQuoteData.workers} trabajadores\n\n` +
    `🛠️ *Servicios Cotizados:*\n${servicesText}${discountText}\n\n` +
    `💰 *TOTAL ESTIMADO:* $${formatCLP(currentQuoteData.totalNeto)} CLP + IVA\n\n` +
    `Solicito que un asesor técnico se comunique conmigo para coordinar el inicio de faena. ¡Muchas gracias!`;

  // Número oficial de WhatsApp de Cero Riesgo Asesorías y Coaching
  const officialPhoneChile = '56950089957';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${officialPhoneChile}&text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank');
}

/* ==========================================================================
   6. CRM LOCAL: GESTOR DE PROSPECTOS / LEADS
   ========================================================================== */
const STORAGE_KEY_LEADS = 'cero_riesgo_leads_db';

function saveLeadToDatabase(quoteData) {
  try {
    const existingLeads = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || '[]');
    const newLead = {
      id: quoteData.folio,
      timestamp: new Date().toISOString(),
      name: quoteData.client.name,
      company: quoteData.client.company,
      phone: quoteData.client.phone,
      email: quoteData.client.email,
      region: quoteData.client.regionName,
      city: quoteData.client.city,
      industry: quoteData.industry,
      workers: quoteData.workers,
      servicesCount: quoteData.services.length,
      totalNeto: quoteData.totalNeto,
      logisticsCost: quoteData.internalLogistics ? quoteData.internalLogistics.total : 0
    };

    existingLeads.unshift(newLead);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(existingLeads.slice(0, 100))); // Máximo 100
  } catch (e) {
    console.warn('Error guardando en base de datos local:', e);
  }
}

function initLeadManagement() {
  // Atajo de teclado secreto para gerencia: Ctrl + Shift + L
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
      e.preventDefault();
      openLeadsModal();
    }
  });

  const btnOpenLeads = document.getElementById('btnOpenLeadsModal');
  const modalOverlay = document.getElementById('leadsModalOverlay');
  const btnCloseLeads = document.getElementById('btnCloseLeadsModal');
  const btnExportCsv = document.getElementById('btnExportLeadsCsv');
  const btnClearLeads = document.getElementById('btnClearLeads');

  if (btnOpenLeads) btnOpenLeads.addEventListener('click', openLeadsModal);
  if (btnCloseLeads) btnCloseLeads.addEventListener('click', closeLeadsModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeLeadsModal();
    });
  }

  if (btnExportCsv) btnExportCsv.addEventListener('click', exportLeadsToCsv);
  if (btnClearLeads) btnClearLeads.addEventListener('click', clearLeadsDatabase);
}

function openLeadsModal() {
  const modal = document.getElementById('leadsModalOverlay');
  const tbody = document.getElementById('leadsTableBody');
  if (!modal || !tbody) return;

  const leads = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || '[]');
  
  if (leads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;">No hay prospectos registrados aún. Cuando los clientes coticen o envíen a WhatsApp, aparecerán aquí.</td></tr>`;
  } else {
    tbody.innerHTML = leads.map(l => `
      <tr>
        <td><strong>${l.id}</strong><br><small style="color: #64748b;">${new Date(l.timestamp).toLocaleString('es-CL')}</small></td>
        <td><strong>${l.company}</strong><br>${l.name}</td>
        <td><a href="tel:${l.phone}" style="color: #ea580c; font-weight: bold;">${l.phone}</a><br><small>${l.email}</small></td>
        <td>${l.city}<br><small style="color: #64748b;">${l.region || ''}</small></td>
        <td>${l.industry.toUpperCase()} (${l.workers})</td>
        <td><strong>$${formatCLP(l.totalNeto)}</strong><br><small style="color: #64748b;">Logística: $${formatCLP(l.logisticsCost || 0)}</small></td>
        <td>
          <a href="https://api.whatsapp.com/send?phone=${l.phone.replace(/[^0-9]/g, '')}&text=Hola%20${encodeURIComponent(l.name)},%20te%20escribimos%20de%20Cero%20Riesgo%20por%20tu%20cotización%20${l.id}" target="_blank" class="btn btn-whatsapp btn-sm" style="padding: 4px 8px; font-size: 11px;">
            <i class="fab fa-whatsapp"></i> Chat
          </a>
        </td>
      </tr>
    `).join('');
  }

  modal.classList.add('active');
}

function closeLeadsModal() {
  const modal = document.getElementById('leadsModalOverlay');
  if (modal) modal.classList.remove('active');
}

function exportLeadsToCsv() {
  const leads = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || '[]');
  if (leads.length === 0) {
    alert('No hay leads para exportar.');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Folio,Fecha,Empresa,Contacto,Telefono,Email,Ciudad,Region,Industria,Trabajadores,MontoNetoCLP,CostoLogisticaInterna\n';

  leads.forEach(l => {
    csvContent += `"${l.id}","${l.timestamp}","${l.company}","${l.name}","${l.phone}","${l.email}","${l.city}","${l.region || ''}","${l.industry}","${l.workers}","${l.totalNeto}","${l.logisticsCost || 0}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `leads_cero_riesgo_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function clearLeadsDatabase() {
  if (confirm('¿Estás seguro de vaciar la lista de cotizaciones registradas?')) {
    localStorage.removeItem(STORAGE_KEY_LEADS);
    openLeadsModal();
  }
}
