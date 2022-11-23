import dayjs from 'dayjs';
import { TestData } from '../entities/nof1Data';
import { Nof1Test } from '../entities/nof1Test';

const generateOdmXML = (test: Nof1Test, data: TestData) => {
	// const parser = new DOMParser();
	const date = dayjs().toISOString();
	const xmlstr = `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
   xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://www.cdisc.org/ns/odm/v1.3 ODM1-3-2.xsd"
   ODMVersion="1.3.2"
   FileOID="nof1companion/${test.uid}/1"
   FileType="Snapshot"
   Description="Nof1 test description"
   CreationDateTime="${date}"
   AsOfDateTime="${date}">

   <Study OID="Study.nof1">
      <GlobalVariables>
         <StudyName>Nof1 test</StudyName>
         <StudyDescription>A Nof1 test to compare the following treatments : ${test.substances.map(
						(s) => s.name,
					)}</StudyDescription>
         <ProtocolName>Nof1 test</ProtocolName>
      </GlobalVariables>
      <MetaDataVersion OID="Metadata.nof1-${date}" Name="Nof1 Metadata">
         <Protocol>
            <!-- <Description></Description> -->
            <StudyEventRef StudyEventOID="Event.design" Mandatory="Yes" />
            <StudyEventRef StudyEventOID="Event.data" Mandatory="Yes" />
         </Protocol>

         <!-- Design -->
         <StudyEventDef OID="Event.design" Name="Nof1 design" Repeating="No" Type="Scheduled">
            <FormRef FormOID="Form.participant-patient" Mandatory="Yes" />
            <FormRef FormOID="Form.participant-physician" Mandatory="Yes" />
            <FormRef FormOID="Form.participant-pharmacy" Mandatory="Yes" />
            <FormRef FormOID="Form.clinicalInfo" Mandatory="No" />
            <FormRef FormOID="Form.nof1-parameters" Mandatory="Yes" />
            <FormRef FormOID="Form.nof1-substance-parameters" Mandatory="Yes" />
         </StudyEventDef>

         <!-- Data -->
         <StudyEventDef OID="Event.data" Name="Nof1 patient data" Repeating="Yes" Type="Scheduled">
            <FormRef FormOID="Form.nof1-monitoredVariables" Mandatory="Yes" />
         </StudyEventDef>

         <!-- Participants -->
         <FormDef OID="Form.participant-patient" Name="Patient info form" Repeating="No">
            <!-- <Description></Description> -->
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-common-info" Mandatory="Yes" />
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-patient" Mandatory="Yes" />
         </FormDef>
         <FormDef OID="Form.participant-physician" Name="Physician info form" Repeating="Yes">
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-common-info" Mandatory="Yes" />
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-physician" Mandatory="Yes" />
         </FormDef>
         <FormDef OID="Form.participant-pharmacy" Name="Pharmacy info form" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.participant-pharmacy" Mandatory="Yes" />
         </FormDef>

         <!-- Clinical info -->
         <FormDef OID="Form.clinicalInfo" Name="Clinical information" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.clinicalInfo" Mandatory="Yes" />
         </FormDef>

         <!-- Nof1 parameters -->
         <FormDef OID="Form.nof1-parameters" Name="Nof1 parameters" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-parameters" Mandatory="Yes" />
         </FormDef>
         <FormDef OID="Form.nof1-substance-parameters" Name="Nof1 substance parameters" Repeating="Yes">
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-substance" Mandatory="Yes" />
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-posology" Mandatory="Yes" />
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-decreasing-posology" Mandatory="No" />
         </FormDef>

         <!-- Data -->
         <FormDef OID="Form.nof1-monitoredVariables" Name="Nof1 monitored variables" Repeating="No">
            <ItemGroupRef ItemGroupOID="ItemGroup.nof1-monitoredVariables" Mandatory="Yes" />
         </FormDef>

         <!-- Participants -->
         <ItemGroupDef OID="ItemGroup.participant-common-info" Name="Common person info" Repeating="No">
            <ItemRef ItemOID="Item.lastname" Mandatory="Yes" />
            <ItemRef ItemOID="Item.firstname" Mandatory="Yes" />
            <ItemRef ItemOID="Item.phone" Mandatory="Yes" />
            <ItemRef ItemOID="Item.email" Mandatory="Yes" />
            <ItemRef ItemOID="Item.street" Mandatory="No" />
            <ItemRef ItemOID="Item.zip" Mandatory="No" />
            <ItemRef ItemOID="Item.city" Mandatory="No" />
            <ItemRef ItemOID="Item.country" Mandatory="No" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.participant-patient" Name="Patient specific info" Repeating="No">
            <ItemRef ItemOID="Item.insurance" Mandatory="Yes" />
            <ItemRef ItemOID="Item.insurance-nb" Mandatory="Yes" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.participant-physician" Name="Physician specific info" Repeating="No">
            <ItemRef ItemOID="Item.institution" Mandatory="Yes" />
            <!-- <ItemRef ItemOID="Item.tests" Mandatory="No"/> -->
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.participant-pharmacy" Name="Pharmacy info" Repeating="No">
            <ItemRef ItemOID="Item.name" Mandatory="No" />
            <ItemRef ItemOID="Item.phone" Mandatory="No" />
            <ItemRef ItemOID="Item.email" Mandatory="Yes" />
            <ItemRef ItemOID="Item.street" Mandatory="No" />
            <ItemRef ItemOID="Item.zip" Mandatory="No" />
            <ItemRef ItemOID="Item.city" Mandatory="No" />
            <ItemRef ItemOID="Item.country" Mandatory="No" />
         </ItemGroupDef>

         <!-- Clinical info -->
         <ItemGroupDef OID="ItemGroup.clinicalInfo" Name="Clinical information" Repeating="No">
            <ItemRef ItemOID="Item.sex" Mandatory="No" />
            <ItemRef ItemOID="Item.age" Mandatory="No" />
            <ItemRef ItemOID="Item.weight" Mandatory="No" />
            <ItemRef ItemOID="Item.height" Mandatory="No" />
            <ItemRef ItemOID="Item.drugsToTest" Mandatory="No" />
            <ItemRef ItemOID="Item.indication" Mandatory="No" />
            <ItemRef ItemOID="Item.otherDiagnoses" Mandatory="No" />
            <ItemRef ItemOID="Item.otherMedications" Mandatory="No" />
            <ItemRef ItemOID="Item.purpose" Mandatory="No" />
         </ItemGroupDef>

         <!-- Nof1 parameters -->
         <ItemGroupDef OID="ItemGroup.nof1-parameters" Name="Nof1 parameters" Repeating="No">
            <ItemRef ItemOID="Item.nbPeriods" Mandatory="Yes" />
            <ItemRef ItemOID="Item.periodLen" Mandatory="Yes" />
            <ItemRef ItemOID="Item.randomizationStrategy" Mandatory="Yes" />
            <ItemRef ItemOID="Item.administrationSequence" Mandatory="Yes" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.nof1-substance" Name="Nof1 parameters" Repeating="No">
            <ItemRef ItemOID="Item.substance" Mandatory="Yes" />
            <ItemRef ItemOID="Item.abbreviation" Mandatory="Yes" />
            <ItemRef ItemOID="Item.unit" Mandatory="Yes" />
            <ItemRef ItemOID="Item.repeatLast" Mandatory="Yes" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.nof1-posology" Name="Posology" Repeating="Yes">
            <ItemRef ItemOID="Item.day" Mandatory="Yes" />
            <ItemRef ItemOID="Item.morningDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.morningFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.noonDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.noonFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.eveningDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.eveningFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.nightDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.nightFraction" Mandatory="Yes" />
         </ItemGroupDef>
         <ItemGroupDef OID="ItemGroup.nof1-decreasing-posology" Name="Decreasing posology" Repeating="Yes">
            <ItemRef ItemOID="Item.day" Mandatory="Yes" />
            <ItemRef ItemOID="Item.morningDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.morningFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.noonDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.noonFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.eveningDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.eveningFraction" Mandatory="Yes" />
            <ItemRef ItemOID="Item.nightDose" Mandatory="Yes" />
            <ItemRef ItemOID="Item.nightFraction" Mandatory="Yes" />
         </ItemGroupDef>

         <!-- Data -->
         <ItemGroupDef OID="ItemGroup..nof1-monitoredVariables" Name="Monitored variable" Repeating="No">
            ${test.monitoredVariables.reduce(
							(acc, v, idx) =>
								(acc += `${
									idx > 0 ? '\n            ' : '' // for indentation
								}<ItemRef ItemOID="Item.${v.name
									.toLowerCase()
									.replaceAll(' ', '-')}" Mandatory="Yes" />`),
							'',
						)}
         </ItemGroupDef>
         ${test.monitoredVariables.reduce(
						(acc, v) =>
							(acc += `<ItemDef OID="Item.${v.name
								.toLowerCase()
								.replaceAll(' ', '-')}" Name="${
								v.name
							}" DataType="string" Length="500">
            <Question>
               <TranslatedText>${v.desc}</TranslatedText>
            </Question>
         </ItemDef>`),
						'',
					)}

         <!-- Participants -->
         <ItemDef OID="Item.lastname" Name="lastname" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.firstname" Name="firstname" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.phone" Name="phone" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.email" Name="email" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.street" Name="street" DataType="string" Length="128"></ItemDef>
         <ItemDef OID="Item.zip" Name="zip" DataType="string" Length="16"></ItemDef>
         <ItemDef OID="Item.city" Name="city" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.country" Name="country" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.insurance" Name="insurance" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.insurance-nb" Name="insurance number" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.institution" Name="institution" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.name" Name="name" DataType="string" Length="64"></ItemDef>

         <!-- Clinical info -->
         <ItemDef OID="Item.sex" Name="Sex" DataType="string" Length="16"></ItemDef>
         <ItemDef OID="Item.age" Name="Age" DataType="string" Length="3"></ItemDef>
         <ItemDef OID="Item.weight" Name="Weight" DataType="string" Length="4"></ItemDef>
         <ItemDef OID="Item.height" Name="Height" DataType="string" Length="4"></ItemDef>
         <ItemDef OID="Item.drugsToTest" Name="Drugs to test" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.indication" Name="Indication for the drug to be tested" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.otherDiagnoses" Name="Other important diagnoses" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.otherMedications" Name="Other current medications" DataType="string" Length="500"></ItemDef>
         <ItemDef OID="Item.purpose" Name="Purpose of the Nof1 test" DataType="string" Length="64"></ItemDef>

         <!-- Nof1 parameters -->
         <ItemDef OID="Item.nbPeriods" Name="Number of periods" DataType="integer"></ItemDef>
         <ItemDef OID="Item.periodLen" Name="Period Length" DataType="integer"></ItemDef>
         <ItemDef OID="Item.randomizationStrategy" Name="Randomization strategy" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.administrationSequence" Name="Substances administration sequence" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.substance" Name="Substance" DataType="string" Length="64"></ItemDef>
         <ItemDef OID="Item.abbreviation" Name="Abbreviation" DataType="string" Length="16"></ItemDef>
         <ItemDef OID="Item.unit" Name="Unit" DataType="string" Length="32"></ItemDef>
         <ItemDef OID="Item.repeatLast" Name="Repeat posology" DataType="boolean"></ItemDef>
         <ItemDef OID="Item.day" Name="Day" DataType="integer"></ItemDef>
         <ItemDef OID="Item.morningDose" Name="Morning Dose" DataType="integer"></ItemDef>
         <ItemDef OID="Item.morningFraction" Name="Morning Fraction" DataType="integer"></ItemDef>
         <ItemDef OID="Item.noonDose" Name="Noon Dose" DataType="integer"></ItemDef>
         <ItemDef OID="Item.noonFraction" Name="Noon Fraction" DataType="integer"></ItemDef>
         <ItemDef OID="Item.eveningDose" Name="Evening Dose" DataType="integer"></ItemDef>
         <ItemDef OID="Item.eveningFraction" Name="Evening Fraction" DataType="integer"></ItemDef>
         <ItemDef OID="Item.nightDose" Name="Night Dose" DataType="integer"></ItemDef>
         <ItemDef OID="Item.nightFraction" Name="Night Fraction" DataType="integer"></ItemDef>
      </MetaDataVersion>
   </Study>

   <AdminData>
      <User OID="${test.nof1Physician.email}" UserType="Investigator">
         <FirstName>${test.nof1Physician.firstname}</FirstName>
         <LastName>${test.nof1Physician.lastname}</LastName>
         <Organization>${test.nof1Physician.institution}</Organization>
         <Address>
            <StreetName>${test.nof1Physician.address.street}</StreetName>
            <City>${test.nof1Physician.address.city}</City>
            <Country>${test.nof1Physician.address.country}</Country>
            <PostalCode>${test.nof1Physician.address.zip}</PostalCode>
         </Address>
         <Email>${test.nof1Physician.email}</Email>
         <Phone>${test.nof1Physician.phone}</Phone>
      </User>
   </AdminData>

   <ClinicalData StudyOID="Study.nof1" MetaDataVersionOID="Metadata.nof1-${date}">
      <SubjectData SubjectKey="${test.patient._id}">
         <!-- Design -->
         <StudyEventData StudyEventOID="Event.design">
            <FormData FormOID="Form.participant-patient">
               <ItemGroupData ItemGroupOID="ItemGroup.participant-common-info">
                  <ItemDataString ItemOID="Item.lastname">
                     <![CDATA[${test.patient.lastname}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.firstname">
                     <![CDATA[${test.patient.firstname}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.phone">
                     <![CDATA[${test.patient.phone}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.email">
                     <![CDATA[${test.patient.email}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.street">
                     <![CDATA[${test.patient.address.street}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.zip">
                     <![CDATA[${test.patient.address.zip}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.city">
                     <![CDATA[${test.patient.address.city}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.country">
                     <![CDATA[${test.patient.address.country}]]>
                  </ItemDataString>
               </ItemGroupData>
               <ItemGroupData ItemGroupOID="ItemGroup.participant-patient">
                  <ItemDataString ItemOID="Item.insurance">
                     <![CDATA[${test.patient.insurance}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.insurance-nb">
                     <![CDATA[${test.patient.insuranceNb}]]>
                  </ItemDataString>
               </ItemGroupData>
            </FormData>
            <FormData FormOID="Form.participant-physician">
               <ItemGroupData ItemGroupOID="ItemGroup.participant-common-info">
                  <ItemDataString ItemOID="Item.lastname">
                     <![CDATA[${test.physician.lastname}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.firstname">
                     <![CDATA[${test.physician.firstname}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.phone">
                     <![CDATA[${test.physician.phone}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.email">
                     <![CDATA[${test.physician.email}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.street">
                     <![CDATA[${test.physician.address.street}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.zip">
                     <![CDATA[${test.physician.address.zip}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.city">
                     <![CDATA[${test.physician.address.city}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.country">
                     <![CDATA[${test.physician.address.country}]]>
                  </ItemDataString>
               </ItemGroupData>
               <ItemGroupData ItemGroupOID="ItemGroup.participant-physician">
                  <ItemDataString ItemOID="Item.institution">
                     <![CDATA[${test.physician.institution}]]>
                  </ItemDataString>
               </ItemGroupData>
            </FormData>
            <FormData FormOID="Form.participant-pharmacy">
               <ItemGroupData ItemGroupOID="ItemGroup.participant-pharmacy">
                  <ItemDataString ItemOID="Item.name">
                     <![CDATA[${test.pharmacy.name}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.phone">
                     <![CDATA[${test.pharmacy.phone}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.email">
                     <![CDATA[${test.pharmacy.email}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.street">
                     <![CDATA[${test.pharmacy.address.street}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.zip">
                     <![CDATA[${test.pharmacy.address.zip}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.city">
                     <![CDATA[${test.pharmacy.address.city}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.country">
                     <![CDATA[${test.pharmacy.address.country}]]>
                  </ItemDataString>
               </ItemGroupData>
            </FormData>
            <FormData FormOID="Form.clinicalInfo">
               <ItemGroupData ItemGroupOID="ItemGroup.clinicalInfo">
                  <ItemDataString ItemOID="Item.sex">${
										test.clinicalInfo.sex
									}</ItemDataString>
                  <ItemDataString ItemOID="Item.age">${
										test.clinicalInfo.age
									}</ItemDataString>
                  <ItemDataString ItemOID="Item.weight">${
										test.clinicalInfo.weight
									}</ItemDataString>
                  <ItemDataString ItemOID="Item.height">${
										test.clinicalInfo.height
									}</ItemDataString>
                  <ItemDataString ItemOID="Item.drugsToTest">
                     <![CDATA[${test.clinicalInfo.drugs}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.indication">
                     <![CDATA[${test.clinicalInfo.indication}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.otherDiagnoses">
                     <![CDATA[${test.clinicalInfo.otherDiag}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.otherMedications">
                     <![CDATA[${test.clinicalInfo.otherDrugs}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.purpose">TODO</ItemDataString>
               </ItemGroupData>
            </FormData>
            <FormData FormOID="Form.nof1-parameters">
               <ItemGroupData ItemGroupOID="ItemGroup.nof1-parameters">
                  <ItemDataInteger ItemOID="Item.nbPeriods">${
										test.nbPeriods
									}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.periodLen">${
										test.periodLen
									}</ItemDataInteger>
                  <ItemDataString ItemOID="Item.randomizationStrategy">${
										test.randomization.strategy
									}${
		test.randomization.maxRep ? ', ' + test.randomization.maxRep : ''
	}</ItemDataString>
                  <ItemDataString ItemOID="Item.administrationSequence">${
										test.substancesSequence
									}</ItemDataString>
               </ItemGroupData>
            </FormData>
            ${test.substances.reduce(
							(acc, sub, idx) =>
								(acc += `${
									idx > 0 ? '\n            ' : '' // for indentation
								}<FormData FormOID="Form.nof1-substance-parameters" FormRepeatKey="${
									sub.name
								}">
               <ItemGroupData ItemGroupOID="ItemGroup.nof1-substance">
                  <ItemDataString ItemOID="Item.substance">
                     <![CDATA[${sub.name}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.abbreviation">
                     <![CDATA[${sub.abbreviation}]]>
                  </ItemDataString>
                  <ItemDataString ItemOID="Item.unit">
                     <![CDATA[${sub.unit}]]>
                  </ItemDataString>
                  <ItemDataBoolean ItemOID="Item.repeatLast">${
										test.selectedPosologies![idx].posology.repeatLast
									}</ItemDataBoolean>
               </ItemGroupData>
               ${test.selectedPosologies![idx].posology.posology.reduce(
									(prev, p, idx) => {
										const tab = idx > 0 ? '\n               ' : ''; // for indentation
										return (prev += `${tab}<ItemGroupData ItemGroupOID="ItemGroup.nof1-posology" ItemGroupRepeatKey="${p.day}">
                  <ItemDataInteger ItemOID="Item.day">${p.day}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.morningDose">${p.morning}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.morningFraction">${p.morningFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.noonDose">${p.noon}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.noonFraction">${p.noonFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.eveningDose">${p.evening}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.eveningFraction">${p.eveningFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.nightDose">${p.night}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.nightFraction">${p.nightFraction}</ItemDataInteger>
               </ItemGroupData>`);
									},
									'',
								)}${
									sub.decreasingDosage
										? sub.decreasingDosage.reduce((prev, p) => {
												const tab = '\n               '; // for indentation
												return (prev += `${tab}<ItemGroupData ItemGroupOID="ItemGroup.nof1-decreasing-posology" ItemGroupRepeatKey="${p.day}">
                  <ItemDataInteger ItemOID="Item.day">${p.day}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.morningDose">${p.morning}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.morningFraction">${p.morningFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.noonDose">${p.noon}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.noonFraction">${p.noonFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.eveningDose">${p.evening}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.eveningFraction">${p.eveningFraction}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.nightDose">${p.night}</ItemDataInteger>
                  <ItemDataInteger ItemOID="Item.nightFraction">${p.nightFraction}</ItemDataInteger>
               </ItemGroupData>`);
										  }, '')
										: ''
								}
            </FormData>`),
							'',
						)}
         </StudyEventData>

         <!-- Data -->
         ${data.reduce((acc, current, idx) => {
						const tab = idx > 0 ? '\n         ' : ''; // for indentation
						return (acc += `${tab}<StudyEventData StudyEventOID="Event.data" StudyEventRepeatKey="${
							current.date
						}">
            <FormData FormOID="Form.nof1-monitoredVariables">
               <ItemGroupData ItemGroupOID="ItemGroup.nof1-monitoredVariables">
                  ${current.data.reduce((prev, d, idx) => {
										const tab = idx > 0 ? '\n                  ' : ''; // for indentation
										return (prev += `${tab}<ItemDataString ItemOID="Item.${d.variableName
											.toLowerCase()
											.replaceAll(' ', '-')}">
                     <![CDATA[${d.value}]]>
                  </ItemDataString>`);
									}, '')}
               </ItemGroupData>
            </FormData>
         </StudyEventData>`);
					}, '')}
      </SubjectData>
   </ClinicalData>
</ODM>`;
	return xmlstr;
	// const doc = parser.parseFromString(xmlstr, 'application/xml');
	// return new XMLSerializer().serializeToString(doc);
};

const addVarData = (doc: Document, data: TestData) => {
	const subjectData = doc.getElementsByTagName('SubjectData');
	data.forEach((d) => {
		const studyEvent = doc.createElement('StudyEventData');
		studyEvent.removeAttribute('xmlns');
		studyEvent.setAttribute('StudyEventOID', 'Event.data');
		studyEvent.setAttribute('StudyEventRepeatKey', `${d.date}`);
		const formData = doc.createElement('FormData');
		formData.setAttribute('FormOID', 'Form.nof1-monitoredVariables');
		const itemGroup = doc.createElement('ItemGroupData');
		itemGroup.setAttribute('ItemGroupOID', 'ItemGroup.nof1-monitoredVariables');
		d.data.forEach((variable) => {
			const item = doc.createElement('ItemDataString');
			item.setAttribute(
				'ItemOID',
				`Item.${variable.variableName.toLowerCase().replaceAll(' ', '-')}`,
			);
			item.appendChild(doc.createCDATASection(variable.value));
			itemGroup.appendChild(item);
		});
		formData.appendChild(itemGroup);
		studyEvent.appendChild(formData);
		subjectData[0].appendChild(studyEvent);
	});
};

export default generateOdmXML;
