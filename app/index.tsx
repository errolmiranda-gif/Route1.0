import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  View,
} from "react-native";

const ink = "#1d1b2b";
const paper = "#f6f4ee";
const yellow = "#ffbd00";

function Label({ children, style }: { children: string; style?: object }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

function Arrow({ light = false }: { light?: boolean }) {
  return <Text style={[styles.arrow, light && styles.arrowLight]}>{"\u203a"}</Text>;
}

export default function Page() {
  const [screen, setScreen] = useState("Welcome");
  const [previousScreen, setPreviousScreen] = useState("Home");
  const [from, setFrom] = useState("District Imus");
  const [to, setTo] = useState("SM City Dasmari\u00f1as");
  const [saved, setSaved] = useState(false);
  const [walking, setWalking] = useState(10);
  const [largeText, setLargeText] = useState(false);
  const [alertsOnHome, setAlertsOnHome] = useState(true);
  const [alertMode, setAlertMode] = useState("Service alerts");
  const [savedMode, setSavedMode] = useState("Journeys");
  const [alertFilter, setAlertFilter] = useState("All");
  const [introStep, setIntroStep] = useState(0);
  const [authMode, setAuthMode] = useState("Sign in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredPassword, setRegisteredPassword] = useState("");
  const navigate = (next: string) => {
    setPreviousScreen(screen);
    setScreen(next);
  };
  const goToTrip = (start: string, destination: string) => {
    setFrom(start);
    setTo(destination);
    navigate("Results");
  };

  return (
    <View style={styles.stage}>
      <StatusBar barStyle={screen === "Welcome" ? "light-content" : "dark-content"} />
      <View style={styles.phone}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {screen === "Welcome" ? <View style={styles.welcomeScreen}>
            <View style={styles.welcomeArt}><View style={styles.welcomeRoadOne} /><View style={styles.welcomeRoadTwo} /><View style={styles.welcomeRouteGold} /><View style={styles.welcomeRouteBlue} /><View style={styles.welcomeStop} /></View>
            <View style={styles.welcomeCopy}><Text style={styles.welcomeBadge}>CAVITE COMMUTE</Text><Text style={styles.welcomeTitle}>Saan ka{"\n"}pupunta?</Text><Text style={styles.welcomeDescription}>Routes, terminals and transfers across Cavite.</Text><Pressable style={styles.primaryButton} onPress={() => navigate("Onboarding")}><Text style={styles.primaryButtonText}>Get started</Text></Pressable><Pressable style={styles.welcomeLink} onPress={() => { setAuthMode("Sign in"); navigate("Auth"); }}><Text style={styles.welcomeLinkText}>I already have an account</Text></Pressable></View>
          </View> : screen === "Onboarding" ? <View style={styles.introScreen}>
            <View style={styles.introTop}><Text style={styles.introCount}>{introStep + 1} / 3</Text><Pressable onPress={() => navigate("Location")}><Text style={styles.skipText}>Skip</Text></Pressable></View>
            <View style={styles.ridePreview}>{[["JEEP", "BUS", "â‰ˆ1h 50m"], ["UV", "TRIKE", "â‰ˆ1h 30m"], ["JEEP", "JEEP", "â‰ˆ2h 15m"]].map((row, i) => <View key={i} style={styles.previewRoute}><View style={styles.previewTags}><Text style={styles.modeTag}>{row[0]}</Text><Text style={styles.routeChevron}>â€º</Text><Text style={[styles.modeTag, styles.modeBlue]}>{row[1]}</Text></View><Text style={styles.previewTime}>{row[2]}</Text></View>)}</View>
            <Text style={styles.introTitle}>{["Know which ride to take.", "Find terminals nearby.", "Save trips for later."][introStep]}</Text><Text style={styles.introDescription}>{["Jeepney, bus, UV Express and tricycle options, compared in one search.", "See useful stops and transfer points around Cavite.", "Keep favorite routes close at hand on this phone."][introStep]}</Text>
            <View style={styles.introBottom}><View style={styles.introDots}>{[0, 1, 2].map(i => <View key={i} style={[styles.introDot, i === introStep && styles.introDotActive]} />)}</View><Pressable style={styles.nextButton} onPress={() => introStep < 2 ? setIntroStep(introStep + 1) : navigate("Location")}><Text style={styles.primaryButtonText}>{introStep < 2 ? "Next  â†’" : "Continue  â†’"}</Text></Pressable></View>
          </View> : screen === "Location" ? <View style={styles.locationScreen}><View style={styles.locationArtwork}><Text style={styles.locationGlyph}>â—Ž</Text></View><Text style={styles.locationTitle}>Use your location?</Text><Text style={styles.locationDescription}>We use it to set your starting point and show nearby terminals. It stays on your phone.</Text><View style={styles.locationActions}><Pressable style={styles.primaryButton} onPress={() => { setFrom("Current location"); setAuthMode("Sign in"); navigate("Auth"); }}><Text style={styles.primaryButtonText}>Allow location</Text></Pressable><Pressable style={styles.welcomeLink} onPress={() => { setAuthMode("Sign in"); navigate("Auth"); }}><Text style={styles.welcomeLinkText}>Not now, I will type it</Text></Pressable></View></View>
          : screen === "Auth" ? <View style={styles.authScreen}>
            <Pressable style={styles.authBack} onPress={() => setScreen("Welcome")}><Text style={styles.authBackText}>â€¹</Text></Pressable><Text style={styles.welcomeBadge}>CAVITE COMMUTE</Text><Text style={styles.authTitle}>{authMode === "Sign in" ? "Welcome back" : "Create your account"}</Text><Text style={styles.authDescription}>Save journeys and terminals across devices.</Text>
            <View style={styles.segmented}>{["Sign in", "Register"].map(mode => <Pressable key={mode} onPress={() => { setAuthMode(mode); setAuthMessage(""); setPasswordVisible(false); }} style={[styles.segment, authMode === mode && styles.segmentActive]}><Text style={[styles.segmentText, authMode === mode && styles.segmentTextActive]}>{mode}</Text></Pressable>)}</View>
            {authMode === "Register" && <><Text style={styles.authFieldLabel}>Name</Text><TextInput value={fullName} onChangeText={setFullName} style={styles.textInput} placeholder="Your name" autoCapitalize="words" /></>}
            <Text style={styles.authFieldLabel}>Email or mobile number</Text><TextInput value={email} onChangeText={setEmail} style={styles.textInput} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" /><Text style={styles.authFieldLabel}>Password</Text><View style={styles.passwordField}><TextInput value={password} onChangeText={setPassword} style={styles.passwordInput} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" secureTextEntry={!passwordVisible} /><Pressable accessibilityRole="button" accessibilityLabel={passwordVisible ? "Hide password" : "Show password"} onPress={() => setPasswordVisible(value => !value)} style={styles.passwordToggle}><View style={styles.eyeIcon}><View style={styles.eyePupil} />{!passwordVisible && <View style={styles.eyeSlash} />}</View></Pressable></View>
            {authMode === "Sign in" && <Pressable style={styles.forgotLink} onPress={() => setAuthMessage("Forgot password? Account recovery is temporarily unavailable in this prototype.")}><Text style={styles.forgotText}>Forgot password?</Text></Pressable>}
            {!!authMessage && <Text style={styles.authMessage}>{authMessage}</Text>}
            <Pressable style={styles.primaryButton} onPress={() => {
              const accountEmail = email.trim().toLowerCase();
              if (!accountEmail || !password.trim() || (authMode === "Register" && !fullName.trim())) {
                setAuthMessage("Please complete the fields above.");
              } else if (authMode === "Register") {
                setRegisteredEmail(accountEmail);
                setRegisteredPassword(password);
                setAuthMessage("");
                setScreen("Home");
              } else if (!registeredEmail) {
                setAuthMessage("No account is registered on this device yet. Choose Register to create one.");
              } else if (registeredEmail !== accountEmail || registeredPassword !== password) {
                setAuthMessage("The email or password doesn't match this device's registered account.");
              } else {
                setAuthMessage("");
                setScreen("Home");
              }
            }}><Text style={styles.primaryButtonText}>{authMode === "Sign in" ? "Sign in" : "Create account"}</Text></Pressable><Text style={styles.prototypeNote}>Prototype account stored in this session only.</Text><View style={styles.guestArea}><Pressable style={styles.guestButton} onPress={() => setScreen("Home")}><Text style={styles.guestButtonText}>Continue as guest</Text></Pressable></View>
          </View> : screen === "Home" ? <>
          <View style={styles.hero}>
            <View style={styles.rings} />
            <View style={styles.brandRow}>
              <View style={styles.brandMark}><Text style={styles.brandMarkText}>LC</Text></View>
              <View><Text style={styles.brandName}>Lakbay</Text><Text style={styles.brandSub}>CAVITE</Text></View>
              <Pressable style={styles.avatar} accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => navigate("Profile")}><Text style={styles.avatarText}>AM</Text></Pressable>
            </View>
            <Label style={styles.greeting}>MAGANDANG UMAGA</Label>
            <Text style={styles.headline}>Saan ang punta{`\n`}natin ngayon?</Text>
            <Pressable style={styles.tripCard} accessibilityRole="button" onPress={() => navigate("Plan a trip")}>
              <View style={styles.tripTrack}><Text style={styles.trackStart}>{"\u25cf"}</Text><View style={styles.trackDash} /><Text style={styles.trackEnd}>{"\u25cf"}</Text></View>
              <View style={styles.tripPlaces}>
                <Label style={styles.placeLabel}>FROM</Label>
                <Text style={styles.place}>{from}</Text>
                <View style={styles.tripDivider} />
                <Label style={styles.placeLabel}>TO</Label>
                <Text style={styles.place}>{to}</Text>
              </View>
              <View style={styles.tripArrow}><Arrow /></View>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Pressable style={styles.notice} accessibilityRole="button" onPress={() => navigate("Alerts")}>
              <View style={styles.noticeIcon}><Text style={styles.bell}>{"\u266a"}</Text></View>
              <View style={styles.noticeCopy}><Text style={styles.noticeTitle}>Traffic update</Text><Text style={styles.noticeText}>Moderate traffic along Aguinaldo Highway near Imus.</Text></View>
              <Arrow />
            </Pressable>

            <View style={styles.sectionHeading}>
              <View><Label>QUICK TRIPS</Label><Text style={styles.sectionTitle}>Popular routes</Text></View>
              <Pressable onPress={() => navigate("Results")}><Text style={styles.viewAll}>View all</Text></Pressable>
            </View>

            <View style={styles.routeGrid}>
              <Pressable style={styles.routeCard} onPress={() => goToTrip("District Imus", "PITX")}>
                <View style={[styles.routeArt, styles.yellowArt]}><Text style={styles.routeBadge}>IMUS</Text><Text style={styles.routeArrow}>{"\u2192"}</Text><Text style={styles.routeBadge}>PITX</Text></View>
                <View style={styles.routeCopy}><Text style={styles.routeName}>Imus to PITX</Text><Text style={styles.routeMeta}>From 55 min Â· â‚±40â€“â‚±55</Text></View>
              </Pressable>
              <Pressable style={styles.routeCard} onPress={() => goToTrip("DasmariÃƒÂ±as", "Alabang")}>
                <View style={[styles.routeArt, styles.greenArt]}><Text style={styles.routeBadge}>DASMA</Text><Text style={styles.routeArrow}>{"\u2192"}</Text><Text style={styles.routeBadge}>ALABANG</Text></View>
                <View style={styles.routeCopy}><Text style={styles.routeName}>Dasma to Alabang</Text><Text style={styles.routeMeta}>From 1 hr Â· â‚±55â€“â‚±70</Text></View>
              </Pressable>
            </View>

            <Pressable style={styles.terminal} onPress={() => navigate("Terminal details")}>
              <View style={styles.pinIcon}><Text style={styles.pinText}>{"\u2316"}</Text></View>
              <View style={styles.terminalCopy}><Text style={styles.terminalTitle}>Find a terminal</Text><Text style={styles.routeMeta}>Browse nearby stops and routes</Text></View>
              <Arrow />
            </Pressable>
          </View>
          </> : <View style={[styles.pageContent, largeText && { transform: [{ scale: 1.04 }] }]}>
            <View style={styles.pageHeader}>{["Alerts", "Saved", "Profile"].includes(screen) ? <View style={styles.headerSpacer} /> : <Pressable onPress={() => setScreen(previousScreen)} style={styles.backButton}><Text style={styles.backText}>â€¹</Text></Pressable>}<Text style={styles.pageTitle}>{screen === "Alerts" ? "Alerts & departures" : screen}</Text><View style={styles.headerSpacer} /></View>
            {screen === "Plan a trip" && <>
              <Text style={styles.formLabel}>STARTING POINT</Text><TextInput value={from} onChangeText={setFrom} style={styles.textInput} placeholder="Choose starting point" />
              <Text style={styles.formLabel}>DESTINATION</Text><TextInput value={to} onChangeText={setTo} style={styles.textInput} placeholder="Choose destination" />
              <Pressable style={styles.secondaryButton} onPress={() => { const old = from; setFrom(to); setTo(old); }}><Text style={styles.secondaryButtonText}>Ã¢â€¡â€¦  Swap locations</Text></Pressable>
              <View style={styles.panel}><Text style={styles.panelTitle}>Maximum walking</Text><Text style={styles.panelNote}>Up to {walking} minutes per leg</Text><View style={styles.choiceRow}>{[5, 10, 15, 20].map(n => <Pressable key={n} onPress={() => setWalking(n)} style={[styles.choice, walking === n && styles.choiceSelected]}><Text style={[styles.choiceText, walking === n && styles.choiceTextSelected]}>{n} min</Text></Pressable>)}</View></View>
              <Pressable style={styles.primaryButton} onPress={() => navigate("Results")}><Text style={styles.primaryButtonText}>Find routes  Ã¢â‚¬Âº</Text></Pressable>
            </>}
            {screen === "Results" && <>
              <View style={styles.journeyBanner}><Label>YOUR JOURNEY</Label><Text style={styles.journeyText}>{from}  Ã¢â€ â€™  {to}</Text></View><Text style={styles.pageIntro}>3 suggested routes Ã‚Â· Typical weekday estimates</Text>
              {["Fastest route", "Fewer transfers", "Lowest estimated fare"].map((name, i) => <Pressable key={name} style={styles.resultCard} onPress={() => navigate("Route details")}><View style={styles.resultTop}><View><Label>{i === 0 ? "RECOMMENDED" : name.toUpperCase()}</Label><Text style={styles.resultTime}>{["1 hr 18 min", "1 hr 31 min", "1 hr 42 min"][i]}</Text></View><Text style={styles.resultFare}>{["Ã¢â€šÂ±70Ã¢â‚¬â€œÃ¢â€šÂ±86", "Ã¢â€šÂ±62Ã¢â‚¬â€œÃ¢â€šÂ±78", "Ã¢â€šÂ±54Ã¢â‚¬â€œÃ¢â€šÂ±66"][i]}</Text></View><Text style={styles.resultRides}>{["JEEP  Ã¢â€ â€™  BUS  Ã¢â€ â€™  JEEP", "BUS  Ã¢â€ â€™  JEEP", "JEEP  Ã¢â€ â€™  JEEP  Ã¢â€ â€™  JEEP"][i]}</Text><Text style={styles.panelNote}>{["Best balance of travel time and transfers", "A simpler trip with only one transfer", "Takes longer, but may save up to Ã¢â€šÂ±20"][i]}</Text><Text style={styles.resultFoot}>Ã¢â€”Å’  {[8, 12, 16][i]} min walk   Ã‚Â·   {i === 1 ? "1 transfer" : "2 transfers"}      Ã¢â‚¬Âº</Text></Pressable>)}
              <Text style={styles.disclaimer}>Times and fares are estimates based on sample route data.</Text>
            </>}
            {screen === "Route details" && <>
              <View style={styles.detailHero}><Label style={styles.detailLabel}>ESTIMATED TRIP</Label><Text style={styles.detailTime}>1 hr 18 min</Text><Text style={styles.detailFare}>Ã¢â€šÂ±70Ã¢â‚¬â€œÃ¢â€šÂ±86 estimated fare  Ã‚Â·  8 min walking</Text></View>
              <View style={styles.journeyBanner}><Label>FROM</Label><Text style={styles.journeyText}>{from}</Text><Label style={styles.detailTo}>TO</Label><Text style={styles.journeyText}>{to}</Text></View>
              {["Walk to pickup point", "Ride toward Imus", "Transfer at Pala-Pala", `Continue to ${to}`].map((step, i) => <View style={styles.stepRow} key={step}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{i + 1}</Text></View><View style={styles.stepCopy}><Label>{["WALK", "JEEP", "TRANSFER", "BUS"][i]}</Label><Text style={styles.panelTitle}>{step}</Text><Text style={styles.panelNote}>{["About 4 minutes", "Confirm the route sign before boarding", "Follow local signs and ask your driver", "Confirm destination and fare before boarding"][i]}</Text></View></View>)}
              <Pressable style={styles.primaryButton} onPress={() => setSaved(!saved)}><Text style={styles.primaryButtonText}>{saved ? "Ã¢Å“â€œ  Saved journey" : "+  Save this journey"}</Text></Pressable><View style={styles.infoPanel}><Text style={styles.panelTitle}>Before you ride</Text><Text style={styles.panelNote}>Routes can change. Confirm the signboard and fare with the driver.</Text></View>
            </>}
            {screen === "Alerts" && <>
              <View style={styles.segmented}>{["Service alerts", "Departures"].map(mode => <Pressable key={mode} onPress={() => setAlertMode(mode)} style={[styles.segment, alertMode === mode && styles.segmentActive]}><Text style={[styles.segmentText, alertMode === mode && styles.segmentTextActive]}>{mode}</Text></Pressable>)}</View>
              {alertMode === "Service alerts" ? <>
                <View style={styles.chipRow}>{["All", "Imus", "DasmariÃ±as"].map(filter => <Pressable key={filter} onPress={() => setAlertFilter(filter)} style={[styles.filterChip, alertFilter === filter && styles.filterChipActive]}><Text style={[styles.filterText, alertFilter === filter && styles.filterTextActive]}>{filter}</Text></Pressable>)}</View>
                {[ ["DELAY Â· IMUS", "Slow traffic near Anabu", "Allow 15â€“20 extra minutes for trips along Aguinaldo Highway."], ["HEAVY TRAFFIC Â· DASMARIÃ‘AS", "Congestion near Pala-Pala", "Northbound buses and jeeps are moving slowly near the intersection."], ["UPDATE Â· CAVITE CITY", "Temporary loading area", "Some PITX-bound buses are loading beside the public market today."] ].filter((_, i) => alertFilter === "All" || (alertFilter === "Imus" ? i === 0 : i === 1)).map((a, i) => <Pressable key={a[0]} style={[styles.alertPanel, i === 1 && { borderLeftColor: "#c74445" }, i === 2 && { borderLeftColor: "#3c69b1" }]} onPress={() => navigate("Plan a trip")}><Label style={i === 1 ? styles.redLabel : i === 2 ? styles.blueLabel : undefined}>{a[0]}</Label><Text style={styles.alertTitle}>{a[1]}</Text><Text style={styles.alertBody}>{a[2]}</Text><Text style={styles.timestamp}>Updated {["12 min", "35 min", "1 hr"][i]} ago</Text></Pressable>)}
              </> : <><Text style={styles.infoBox}>Typical frequencies only. Most routes do not publish fixed timetables.</Text>{["PITX via Aguinaldo Highway", "Alabang via Daang Hari", "Trece Martires Bayan"].map((name, i) => <Pressable style={styles.departureRow} key={name} onPress={() => { setTo(name.split(" via ")[0]); navigate("Plan a trip"); }}><Text style={styles.ridePill}>{i === 1 ? "UV" : "BUS"}</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>{name}</Text><Text style={styles.panelNote}>From Pala-Pala Terminal</Text></View><Text style={styles.departureTime}>{i === 0 ? "10â€“15" : "15â€“25"} min</Text></Pressable>)}</>}
            </>}
            {screen === "Saved" && <>
              <View style={styles.segmented}>{["Journeys", "Terminals"].map(mode => <Pressable key={mode} onPress={() => setSavedMode(mode)} style={[styles.segment, savedMode === mode && styles.segmentActive]}><Text style={[styles.segmentText, savedMode === mode && styles.segmentTextActive]}>{mode}{mode === "Journeys" ? " (" + (saved ? 1 : 0) + ")" : ""}</Text></Pressable>)}</View>
              {savedMode === "Journeys" && saved ? <View style={styles.resultCard}><Pressable onPress={() => navigate("Route details")}><Label>SAVED JOURNEY</Label><Text style={styles.panelTitle}>{from} to {to}</Text><Text style={styles.panelNote}>1 hr 18 min Â· â‚±70â€“â‚±86 Â· JEEP â†’ BUS â†’ JEEP</Text></Pressable><Pressable onPress={() => setSaved(false)}><Text style={styles.removeLink}>Remove saved journey</Text></Pressable></View> : <View style={styles.savedEmpty}><View style={styles.emptyIconBubble}><Text style={styles.emptyIcon}>â™§</Text></View><Text style={styles.emptyTitle}>No saved {savedMode.toLowerCase()} yet</Text><Text style={styles.emptyDescription}>Save a route to find it here, even when you are offline.</Text>{savedMode === "Journeys" && <Pressable style={styles.primaryButton} onPress={() => navigate("Plan a trip")}><Text style={styles.primaryButtonText}>Plan a trip</Text></Pressable>}<Text style={styles.savedFootnote}>Saved securely on this phone.</Text></View>}
            </>}
            {screen === "Terminal details" && <><View style={styles.terminalBanner}><Text style={styles.terminalBannerTitle}>PALA-PALA</Text><Text style={styles.terminalBannerSub}>TRANSPORT TERMINAL</Text></View><Label style={styles.groupLabel}>DASMARIÃƒâ€˜AS</Label><Text style={styles.terminalHeading}>Pala-Pala Terminal</Text><Text style={styles.pageIntro}>A busy transfer point near Robinsons DasmariÃƒÂ±as and Aguinaldo Highway.</Text><Pressable style={styles.primaryButton} onPress={() => { setFrom("Pala-Pala Terminal"); setScreen("Plan a trip"); }}><Text style={styles.primaryButtonText}>Plan from here  Ã¢â‚¬Âº</Text></Pressable><Text style={styles.sectionTitle}>Routes from this terminal</Text>{["PITX via Aguinaldo Highway", "Alabang via Daang Hari", "Trece Martires Bayan"].map((name, i) => <View style={styles.departureRow} key={name}><Text style={styles.ridePill}>{i === 1 ? "UV" : "BUS"}</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>{name}</Text><Text style={styles.panelNote}>Every {i === 0 ? "10Ã¢â‚¬â€œ15" : "15Ã¢â‚¬â€œ25"} min Ã‚Â· 5:00 AMÃ¢â‚¬â€œ10:00 PM</Text></View></View>)}</>}
            {screen === "Profile" && <>
              <View style={styles.profileCard}><View style={styles.profileAvatar}><Text style={styles.avatarText}>AM</Text></View><View style={{ flex: 1 }}><Text style={styles.profileName}>Alex Mendoza</Text><Text style={styles.profileSub}>Usual area: Imus</Text></View><Pressable style={styles.editButton} onPress={() => navigate("Edit profile")}><Text style={styles.editButtonText}>Edit</Text></Pressable></View>
              <Label style={styles.groupLabel}>COMMUTE PREFERENCES</Label><View style={styles.settingsCard}><Pressable style={styles.settingsRow} onPress={() => navigate("Plan a trip")}><Text style={styles.settingIcon}>â—‡</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>Ride types</Text><Text style={styles.panelNote}>Jeep, Bus and UV</Text></View><Arrow /></Pressable><Pressable style={styles.settingsRow} onPress={() => navigate("Plan a trip")}><Text style={styles.settingIcon}>â™™</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>Maximum walking</Text><Text style={styles.panelNote}>{walking} minutes per leg</Text></View><Arrow /></Pressable></View>
              <Label style={styles.groupLabel}>SETTINGS</Label><View style={styles.settingsCard}><Pressable style={styles.settingsRow} onPress={() => setAlertsOnHome(!alertsOnHome)}><Text style={styles.settingIcon}>â™§</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>Alerts on Home</Text><Text style={styles.panelNote}>Show notices for Imus</Text></View><View style={[styles.switch, alertsOnHome && styles.switchOn]}><View style={styles.switchKnob} /></View></Pressable><Pressable style={styles.settingsRow} onPress={() => setLargeText(!largeText)}><Text style={styles.settingIcon}>â˜°</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>Larger text</Text><Text style={styles.panelNote}>Bigger text across the app</Text></View><View style={[styles.switch, largeText && styles.switchOn]}><View style={[styles.switchKnob, largeText && styles.switchKnobOn]} /></View></Pressable><Pressable style={styles.settingsRow} onPress={() => navigate("Terminal details")}><Text style={styles.settingIcon}>â—Ž</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>Location</Text><Text style={styles.panelNote}>On Â· near District Imus</Text></View><Text style={styles.editLink}>Check</Text></Pressable></View>
              <Label style={styles.groupLabel}>HELP</Label><View style={styles.settingsCard}><Pressable style={styles.settingsRow} onPress={() => navigate("Route details")}><Text style={styles.settingIcon}>â—‡</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>How to read a route</Text></View><Arrow /></Pressable><Pressable style={styles.settingsRow} onPress={() => navigate("Alerts")}><Text style={styles.settingIcon}>â˜°</Text><View style={{ flex: 1 }}><Text style={styles.panelTitle}>About our data</Text><Text style={styles.panelNote}>What is sample vs. verified</Text></View><Arrow /></Pressable></View>
              <Pressable style={styles.resetButton} onPress={() => { setSaved(false); setFrom("District Imus"); setTo("SM City DasmariÃ±as"); setScreen("Home"); }}><Text style={styles.resetText}>Reset app and onboarding</Text></Pressable><Text style={styles.savedFootnote}>Lakbay Cavite Â· sample data build</Text>
            </>}
            {screen === "Edit profile" && <><Text style={styles.formLabel}>YOUR NAME</Text><TextInput style={styles.textInput} defaultValue="Alex Mendoza" /><Text style={styles.formLabel}>USUAL AREA</Text><TextInput style={styles.textInput} defaultValue="Imus" /><Pressable style={styles.primaryButton} onPress={() => navigate("Profile")}><Text style={styles.primaryButtonText}>Save profile</Text></Pressable></>}
          </View>}
        </ScrollView>

        {["Home", "Alerts", "Saved", "Profile", "Plan a trip", "Results", "Route details", "Terminal details", "Edit profile"].includes(screen) && <View style={styles.bottomNav}>
          {[["Home", "\u2302"], ["Explore", "\u25c7"], ["Alerts", "\u266a"], ["Saved", "\u25c7"], ["Profile", "\u2659"]].map(([label, icon]) => (
            <Pressable key={label} onPress={() => label !== "Explore" && navigate(label)} style={styles.navItem} accessibilityRole="button" accessibilityState={{ selected: screen === label }}>
              <View style={[styles.navIconWrap, screen === label && styles.navIconActive]}><Text style={[styles.navIcon, screen === label && styles.navIconSelected]}>{icon}</Text>{label === "Alerts" && <View style={styles.alertDot} />}</View>
              <Text style={[styles.navLabel, screen === label && styles.navLabelActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#dedbd1" },
  phone: { width: "100%", maxWidth: 440, height: "100%", maxHeight: 820, minHeight: 0, overflow: "hidden", backgroundColor: paper, borderRadius: 28, shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 12 },
  scrollContent: { flexGrow: 1, paddingBottom: 10 },
  hero: { minHeight: 367, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, overflow: "hidden", borderBottomLeftRadius: 28, borderBottomRightRadius: 28, backgroundColor: ink },
  rings: { position: "absolute", width: 260, height: 260, borderRadius: 130, borderWidth: 1, borderColor: "#373340", right: -92, top: 25 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: { width: 43, height: 43, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: yellow, transform: [{ rotate: "-4deg" }] },
  brandMarkText: { color: ink, fontWeight: "900", fontSize: 16 },
  brandName: { color: "white", fontWeight: "800", fontSize: 13, lineHeight: 15 },
  brandSub: { color: yellow, fontSize: 9, fontWeight: "900", letterSpacing: 1.3 },
  avatar: { marginLeft: "auto", width: 41, height: 41, borderRadius: 22, borderWidth: 2, borderColor: "#615d6b", alignItems: "center", justifyContent: "center", backgroundColor: "#353342" },
  avatarText: { color: "white", fontSize: 12, fontWeight: "800" },
  label: { color: "#747184", fontWeight: "800", fontSize: 9, letterSpacing: 1.25 },
  greeting: { marginTop: 35, color: yellow },
  headline: { marginTop: 7, marginBottom: 23, color: "white", fontSize: 29, fontWeight: "900", lineHeight: 33, letterSpacing: -0.8 },
  tripCard: { minHeight: 132, borderRadius: 18, backgroundColor: "white", flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 15 },
  tripTrack: { width: 20, alignItems: "center", alignSelf: "stretch", justifyContent: "center" },
  trackStart: { color: ink, fontSize: 12 },
  trackDash: { height: 36, borderLeftWidth: 1, borderStyle: "dashed", borderColor: "#9a96a2" },
  trackEnd: { color: yellow, fontSize: 14 },
  tripPlaces: { flex: 1, marginLeft: 2 },
  placeLabel: { fontSize: 8, letterSpacing: 1, marginBottom: 2 },
  place: { color: ink, fontSize: 14, fontWeight: "800" },
  tripDivider: { height: 1, backgroundColor: "#eeeaf1", marginVertical: 10 },
  tripArrow: { width: 36, height: 36, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: yellow, marginLeft: 10 },
  arrow: { color: ink, fontSize: 28, lineHeight: 30, textAlign: "center" },
  arrowLight: { color: "white" },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  notice: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: "#f1d46c", backgroundColor: "#fff8df" },
  noticeIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: yellow, alignItems: "center", justifyContent: "center" },
  bell: { color: ink, fontSize: 22, fontWeight: "700" },
  noticeCopy: { flex: 1 },
  noticeTitle: { color: ink, fontSize: 12, fontWeight: "800", marginBottom: 3 },
  noticeText: { color: "#655d48", fontSize: 9, lineHeight: 13 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 31, marginBottom: 13 },
  sectionTitle: { marginTop: 6, color: ink, fontSize: 20, lineHeight: 24, fontWeight: "900" },
  viewAll: { color: ink, fontSize: 11, fontWeight: "800", textDecorationLine: "underline", marginBottom: 3 },
  routeGrid: { flexDirection: "row", gap: 10 },
  routeCard: { flex: 1, overflow: "hidden", borderRadius: 16, backgroundColor: "white", borderWidth: 1, borderColor: "#e6e1d7", elevation: 2 },
  routeArt: { height: 74, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  yellowArt: { backgroundColor: "#f2d36b" },
  greenArt: { backgroundColor: "#a9d8c2" },
  routeBadge: { paddingHorizontal: 5, paddingVertical: 4, borderWidth: 2, borderColor: ink, borderRadius: 3, backgroundColor: "white", color: ink, fontSize: 8, fontWeight: "900" },
  routeArrow: { color: ink, fontSize: 17 },
  routeCopy: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 11 },
  routeName: { color: ink, fontSize: 12, fontWeight: "800", marginBottom: 5 },
  routeMeta: { color: "#777282", fontSize: 9 },
  terminal: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: "#e7e2d8", backgroundColor: "white" },
  pinIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#fff0bd" },
  pinText: { color: ink, fontSize: 25 },
  terminalCopy: { flex: 1 },
  terminalTitle: { color: ink, fontSize: 12, fontWeight: "800", marginBottom: 3 },
  bottomNav: { height: 78, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingBottom: 3, borderTopWidth: 1, borderTopColor: "#e4e0d7", backgroundColor: "white" },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  navIconWrap: { width: 34, height: 30, alignItems: "center", justifyContent: "center", position: "relative" },
  navIconActive: { borderRadius: 18, backgroundColor: "#fff0bd" },
  navIcon: { color: "#898694", fontSize: 22, lineHeight: 26 },
  navIconSelected: { color: ink },
  navLabel: { color: "#888592", fontSize: 9, fontWeight: "700" },
  navLabelActive: { color: ink },
  alertDot: { position: "absolute", width: 6, height: 6, borderRadius: 3, backgroundColor: "#d54150", right: 0, top: 2 },
  pageContent: { flex: 1, minHeight: 700, paddingHorizontal: 20, paddingBottom: 22, backgroundColor: paper },
  pageHeader: { minHeight: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: -20, marginBottom: 12, paddingHorizontal: 17, borderBottomWidth: 1, borderBottomColor: "#e6e2d9", backgroundColor: paper },
  backButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "white" },
  backText: { color: ink, fontSize: 28, lineHeight: 30 },
  pageTitle: { color: ink, fontSize: 17, fontWeight: "900" },
  headerSpacer: { width: 36 },
  formLabel: { color: "#777282", fontSize: 9, fontWeight: "800", letterSpacing: 1.1, marginTop: 14, marginBottom: 6 },
  textInput: { height: 51, paddingHorizontal: 14, marginBottom: 8, borderWidth: 1, borderColor: "#e2ded5", borderRadius: 12, backgroundColor: "white", color: ink, fontSize: 14, fontWeight: "700" },
  secondaryButton: { minHeight: 44, alignItems: "center", justifyContent: "center", marginVertical: 10, borderWidth: 1, borderColor: "#ded9cf", borderRadius: 12, backgroundColor: "white" },
  secondaryButtonText: { color: ink, fontSize: 12, fontWeight: "800" },
  primaryButton: { minHeight: 50, alignItems: "center", justifyContent: "center", marginTop: 12, paddingHorizontal: 15, borderRadius: 13, backgroundColor: yellow },
  primaryButtonText: { color: ink, fontSize: 13, fontWeight: "900" },
  panel: { padding: 14, marginTop: 15, borderRadius: 14, backgroundColor: "white" },
  panelTitle: { color: ink, fontSize: 13, fontWeight: "800", marginBottom: 4 },
  panelNote: { color: "#777282", fontSize: 11, lineHeight: 16 },
  choiceRow: { flexDirection: "row", gap: 7, marginTop: 12 },
  choice: { flex: 1, alignItems: "center", paddingVertical: 9, borderWidth: 1, borderColor: "#e5e1d8", borderRadius: 10 },
  choiceSelected: { borderColor: ink, backgroundColor: ink },
  choiceText: { color: ink, fontSize: 10, fontWeight: "800" },
  choiceTextSelected: { color: "white" },
  journeyBanner: { padding: 14, borderRadius: 14, backgroundColor: ink },
  journeyText: { marginTop: 4, color: "white", fontSize: 14, fontWeight: "800" },
  pageIntro: { marginTop: 8, marginBottom: 14, color: "#777282", fontSize: 12, lineHeight: 18 },
  resultCard: { padding: 14, marginBottom: 11, borderWidth: 1, borderColor: "#e7e2d8", borderRadius: 16, backgroundColor: "white" },
  resultTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  resultTime: { marginTop: 4, color: ink, fontSize: 22, fontWeight: "900" },
  resultFare: { overflow: "hidden", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 7, backgroundColor: "#fff0bd", color: ink, fontSize: 12, fontWeight: "900" },
  resultRides: { marginTop: 10, marginBottom: 7, color: ink, fontSize: 11, fontWeight: "900" },
  resultFoot: { marginTop: 10, paddingTop: 9, borderTopWidth: 1, borderTopColor: "#eeeae2", color: "#777282", fontSize: 10 },
  disclaimer: { marginTop: 4, color: "#777282", fontSize: 10, textAlign: "center" },
  detailHero: { alignItems: "center", padding: 20, borderRadius: 16, backgroundColor: ink },
  detailLabel: { color: yellow },
  detailTime: { marginTop: 6, color: "white", fontSize: 29, fontWeight: "900" },
  detailFare: { marginTop: 7, color: "#d2cfda", fontSize: 10 },
  detailTo: { marginTop: 12 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 11, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#e7e2d8" },
  stepNumber: { width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 15, borderWidth: 2, borderColor: ink, backgroundColor: "white" },
  stepNumberText: { color: ink, fontSize: 11, fontWeight: "900" },
  stepCopy: { flex: 1 },
  infoPanel: { padding: 14, marginTop: 12, borderRadius: 13, backgroundColor: "#fff2c8" },
  alertPanel: { padding: 14, marginBottom: 10, borderRadius: 14, borderLeftWidth: 4, borderLeftColor: yellow, backgroundColor: "white" },
  redLabel: { color: "#c6474d" },
  blueLabel: { color: "#3971b9" },
  timestamp: { marginTop: 9, color: "#9995a0", fontSize: 9 },
  emptyPanel: { alignItems: "center", padding: 30, marginTop: 15, borderRadius: 16, backgroundColor: "white" },
  emptyIcon: { color: yellow, fontSize: 42, marginBottom: 8 },
  removeLink: { marginTop: 12, color: "#b44247", fontSize: 11, fontWeight: "800", textAlign: "center" },
  terminalBanner: { alignItems: "center", justifyContent: "center", minHeight: 150, marginHorizontal: -20, backgroundColor: "#d7bd6b" },
  terminalBannerTitle: { paddingHorizontal: 20, paddingVertical: 10, borderWidth: 4, borderColor: ink, backgroundColor: "white", color: ink, fontSize: 25, fontWeight: "900" },
  terminalBannerSub: { marginTop: 4, color: ink, fontSize: 9, fontWeight: "900", letterSpacing: 1.3 },
  groupLabel: { marginTop: 19, marginBottom: 8 },
  terminalHeading: { marginTop: 4, color: ink, fontSize: 23, fontWeight: "900" },
  departureRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#e6e2d9" },
  ridePill: { paddingHorizontal: 7, paddingVertical: 5, borderRadius: 5, backgroundColor: yellow, color: ink, fontSize: 9, fontWeight: "900" },
  profileAvatar: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: yellow },
  editLink: { color: "#3470b3", fontSize: 11, fontWeight: "800" },
  toggleText: { color: "#357550", fontSize: 10, fontWeight: "900" },
  segmented: { flexDirection: "row", gap: 3, padding: 4, marginBottom: 13, borderRadius: 14, backgroundColor: "#e8e4da" },
  segment: { flex: 1, minHeight: 39, alignItems: "center", justifyContent: "center", borderRadius: 11 },
  segmentActive: { backgroundColor: "white", shadowColor: "#1c1b2b", shadowOpacity: 0.08, shadowRadius: 4, elevation: 1 },
  segmentText: { color: "#777282", fontSize: 11, fontWeight: "700" },
  segmentTextActive: { color: ink },
  chipRow: { flexDirection: "row", gap: 7, marginBottom: 13 },
  filterChip: { minHeight: 36, justifyContent: "center", paddingHorizontal: 14, borderWidth: 1, borderColor: "#e4dfd5", borderRadius: 20, backgroundColor: "white" },
  filterChipActive: { borderColor: ink, backgroundColor: ink },
  filterText: { color: ink, fontSize: 11, fontWeight: "700" },
  filterTextActive: { color: "white" },
  alertTitle: { color: ink, fontSize: 14, fontWeight: "500", marginTop: 6 },
  alertBody: { color: "#383545", fontSize: 11, lineHeight: 16, marginTop: 3 },
  infoBox: { padding: 12, marginBottom: 8, borderRadius: 11, backgroundColor: "#e4ecf8", color: "#345987", fontSize: 11, lineHeight: 16 },
  departureTime: { color: ink, fontSize: 11, fontWeight: "800" },
  savedEmpty: { flex: 1, minHeight: 520, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  emptyIconBubble: { width: 78, height: 78, alignItems: "center", justifyContent: "center", marginBottom: 14, borderRadius: 40, backgroundColor: "#fff0bd" },
  emptyTitle: { color: ink, fontSize: 18, fontWeight: "900", textAlign: "center" },
  emptyDescription: { maxWidth: 270, marginTop: 5, color: "#777282", fontSize: 12, lineHeight: 18, textAlign: "center" },
  savedFootnote: { marginTop: 28, color: "#918c9a", fontSize: 9, textAlign: "center" },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 11, padding: 15, borderRadius: 16, backgroundColor: ink },
  profileName: { color: "white", fontSize: 14, fontWeight: "800" },
  profileSub: { marginTop: 3, color: "#aaa6b2", fontSize: 10 },
  editButton: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 8, backgroundColor: yellow },
  editButtonText: { color: ink, fontSize: 10, fontWeight: "900" },
  settingsCard: { overflow: "hidden", borderWidth: 1, borderColor: "#e4dfd5", borderRadius: 15, backgroundColor: "white" },
  settingsRow: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#ebe7df", backgroundColor: "white" },
  settingIcon: { width: 32, height: 32, textAlign: "center", textAlignVertical: "center", overflow: "hidden", borderRadius: 9, backgroundColor: paper, color: ink, fontSize: 19 },
  switch: { width: 42, height: 24, justifyContent: "center", paddingHorizontal: 2, borderRadius: 14, backgroundColor: "#c8c4bc" },
  switchOn: { alignItems: "flex-end", backgroundColor: "#238264" },
  switchKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: "white", elevation: 1 },
  switchKnobOn: { alignSelf: "flex-end" },
  resetButton: { minHeight: 44, alignItems: "center", justifyContent: "center", marginTop: 18, borderWidth: 1, borderColor: "#e5b6b3", borderRadius: 11, backgroundColor: "#fff5f4" },
  resetText: { color: "#bd4146", fontSize: 10, fontWeight: "800" },
  welcomeScreen: { flex: 1, minHeight: 740, overflow: "hidden", backgroundColor: ink },
  welcomeArt: { flex: 1, minHeight: 310, position: "relative", overflow: "hidden", backgroundColor: ink },
  welcomeRoadOne: { position: "absolute", top: -70, left: "56%", width: 10, height: 360, borderRadius: 8, backgroundColor: "#393746", transform: [{ rotate: "24deg" }] },
  welcomeRoadTwo: { position: "absolute", top: 80, left: -55, width: 370, height: 8, borderRadius: 6, backgroundColor: "#393746", transform: [{ rotate: "-29deg" }] },
  welcomeRouteGold: { position: "absolute", top: 105, left: "52%", width: 6, height: 165, borderRadius: 5, backgroundColor: "#b18d25", transform: [{ rotate: "-7deg" }] },
  welcomeRouteBlue: { position: "absolute", top: -20, left: "62%", width: 7, height: 360, borderRadius: 5, borderColor: "#4c6eb4", borderLeftWidth: 5, borderStyle: "dashed", transform: [{ rotate: "8deg" }] },
  welcomeStop: { position: "absolute", top: "49%", left: "57%", width: 16, height: 16, borderWidth: 3, borderColor: ink, backgroundColor: "white", transform: [{ rotate: "45deg" }] },
  welcomeCopy: { flex: 1, justifyContent: "center", paddingHorizontal: 24, paddingBottom: 34, backgroundColor: ink },
  welcomeBadge: { alignSelf: "flex-start", marginBottom: 18, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 3, backgroundColor: yellow, color: ink, fontSize: 17, fontWeight: "900", letterSpacing: 0.4 },
  welcomeTitle: { color: "white", fontSize: 29, fontWeight: "900", lineHeight: 32 },
  welcomeDescription: { marginTop: 10, color: "#b8b6c1", fontSize: 14, lineHeight: 21 },
  welcomeLink: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: 7 },
  welcomeLinkText: { color: ink, fontSize: 13, fontWeight: "800" },
  introScreen: { flex: 1, minHeight: 740, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 22, backgroundColor: paper },
  introTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  introCount: { color: "#777282", fontSize: 13, fontWeight: "800" },
  skipText: { color: ink, fontSize: 12, fontWeight: "800" },
  ridePreview: { gap: 9, padding: 16, marginBottom: 23, borderWidth: 1, borderColor: "#e4dfd5", borderRadius: 18, backgroundColor: "white" },
  previewRoute: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 58, padding: 10, borderRadius: 12, backgroundColor: paper },
  previewTags: { flexDirection: "row", alignItems: "center", gap: 5 },
  modeTag: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, backgroundColor: yellow, color: ink, fontSize: 9, fontWeight: "900" },
  modeBlue: { backgroundColor: "#3262c7", color: "white" },
  modeGreen: { backgroundColor: "#318957", color: "white" },
  routeChevron: { color: ink, fontSize: 18 },
  previewTime: { color: ink, fontSize: 12, fontWeight: "900" },
  introTitle: { marginTop: 4, color: ink, fontSize: 24, fontWeight: "900" },
  introDescription: { marginTop: 7, color: "#777282", fontSize: 14, lineHeight: 21 },
  introBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto" },
  introDots: { flexDirection: "row", alignItems: "center", gap: 6 },
  introDot: { width: 8, height: 8, borderRadius: 5, backgroundColor: "#e1ddd3" },
  introDotActive: { width: 20, backgroundColor: ink },
  nextButton: { minWidth: 104, minHeight: 46, alignItems: "center", justifyContent: "center", paddingHorizontal: 12, borderRadius: 13, backgroundColor: yellow },
  locationScreen: { flex: 1, minHeight: 740, alignItems: "center", justifyContent: "center", padding: 26, backgroundColor: paper },
  locationArtwork: { width: 144, height: 144, alignItems: "center", justifyContent: "center", marginBottom: 26, borderRadius: 80, backgroundColor: "#e7edfc" },
  locationGlyph: { width: 100, height: 100, borderRadius: 55, backgroundColor: "#d4def7", color: "#3262c7", fontSize: 54, lineHeight: 100, textAlign: "center" },
  locationTitle: { color: ink, fontSize: 22, fontWeight: "900" },
  locationDescription: { maxWidth: 300, marginTop: 10, color: "#777282", fontSize: 14, lineHeight: 22, textAlign: "center" },
  locationActions: { width: "100%", marginTop: "auto" },
  authScreen: { flex: 1, minHeight: 740, paddingHorizontal: 22, paddingTop: 16, paddingBottom: 20, backgroundColor: paper },
  authBack: { width: 32, height: 32, justifyContent: "center", marginBottom: 13 },
  authBackText: { color: ink, fontSize: 27 },
  authTitle: { marginTop: 4, color: ink, fontSize: 24, fontWeight: "900" },
  authDescription: { marginTop: 5, marginBottom: 17, color: "#777282", fontSize: 13, lineHeight: 19 },
  authFieldLabel: { marginTop: 9, marginBottom: 5, color: ink, fontSize: 11, fontWeight: "700" },
  passwordField: { height: 51, flexDirection: "row", alignItems: "center", marginBottom: 8, paddingLeft: 14, paddingRight: 8, borderWidth: 1, borderColor: "#e2ded5", borderRadius: 12, backgroundColor: "white" },
  passwordInput: { flex: 1, height: 49, padding: 0, color: ink, fontSize: 14, fontWeight: "700" },
  passwordToggle: { minWidth: 48, minHeight: 36, alignItems: "center", justifyContent: "center", paddingHorizontal: 7, borderRadius: 8 },
  eyeIcon: { width: 20, height: 14, alignItems: "center", justifyContent: "center", borderWidth: 1.7, borderColor: "#5f5b6b", borderRadius: 10, transform: [{ rotate: "-3deg" }] },
  eyePupil: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#5f5b6b" },
  eyeSlash: { position: "absolute", width: 24, height: 1.6, backgroundColor: "#5f5b6b", transform: [{ rotate: "-42deg" }] },
  forgotLink: { alignSelf: "flex-end", marginTop: 2, marginBottom: 8 },
  forgotText: { color: ink, fontSize: 11, fontWeight: "700" },
  authMessage: { marginTop: 7, color: "#b44247", fontSize: 11 },
  prototypeNote: { marginTop: 8, color: "#777282", fontSize: 10, textAlign: "center" },
  guestArea: { flex: 1, justifyContent: "flex-end" },
  guestButton: { minHeight: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#e4dfd5", borderRadius: 12, backgroundColor: "white" },
  guestButtonText: { color: ink, fontSize: 13, fontWeight: "800" },
});




